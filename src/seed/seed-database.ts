import { initialData } from './seed';
import { prisma } from '../lib/prisma';
import { countries } from './seed-countries';

async function main() {
  // 1. Borrar registros previos
  //await Promise.all([

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  //]);

  // obtenemos los datos de las tablas
  const { categories, products, users } = initialData;

  // insertamos muchos usuarios en la tabla user
  await prisma.user.createMany({
    data: users,
  });

  // insertamos los países en la tabla de country
  await prisma.country.createMany({
    data: countries,
  });

  // transformamos las categorias ["Shirts","Pants","Hoodies"] a [ { name: "Shirts" },  { name: "Pants" },  { name: "Hoodies" }]
  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  // se insertan las categorias
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();
  //console.log(categoriesDB);

  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>
  ); //<string=shirt, string=categoriID
  console.log(categoriesMap);

  //Productos

  products.forEach(async (prod) => {
    const product = prod;
    if (!product) throw new Error('No products found');
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type]!,
      },
    });

    //Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData!,
    });
  });
  /* // Para 1 solo producto
  const { images, type, ...productData } = product1;
  await prisma.product.create({
    data: {
      ...productData,
      categoryId: categoriesMap['shirts']!,
    },
  }); */

  console.log('Seed ejecutado correctamente');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;

  main();
})();
