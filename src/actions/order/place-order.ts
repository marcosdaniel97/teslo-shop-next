'use server';

import { auth } from '@/auth.config';
import { Address, Size } from '@/interfaces';
import { prisma } from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar la sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesión de usuario',
    };
  }

  // Obtener la información de los productos
  // Nota: recuerden que podemos llevar 2+ productos con el mismo ID
  // Devuelve un array con objetos de productos dentro
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId), // crea un array: ['id_1','id_2']
      },
    },
  });

  // Calcular los montos // Encabezado del maestro-detalle

  // Cantidad total de items
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  // Calculo de totales de tax, subtotal y total. Esto se hace con la cantidad de los productos del carrito pero calculado con el precio de los productos en la
  // base de datos para evitar que el usuario modifique el precio.
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId); // buscamos el producto del carrito en la base de datos

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // Crear la transacción de base de datos: Se ejecuta todo junto, si pasa algo malo se deshace (rollback)

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      // products viene de la bd
      const updatedProductsPromises = products.map((product) => {
        // Acumular las cantidades
        // Filtra todos los prods con mismo id pero distintos talles y a la vez acumula las cantidades
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            //inStock: product.inStock - productQuantity // no hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en las existencias si no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear la orden - Encabezado - Detalles
      // crea un registro en la tabla Order
      const order = await tx.order.create({
        data: {
          // Esto es la cabecera de la orden
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          // Vamos a tener varios items - Este es el detalle de la orden
          orderItems: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // Validar, si el precio es cero, entonces, lanzar un error

      // 3. Crear la direccion de la orden
      // se desestructura para renombrar, la bd espera countryId, en el front tenemos country
      const { country, ...restAddress } = address;
      const { userId: _, id: __, ...safeAddress } = restAddress as any;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...safeAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        updatedProducts: updatedProducts,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
