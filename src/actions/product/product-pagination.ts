'use server';

import { Gender } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  // validación parecida al de la paginación, pero que es necesaria estar aquí
  if (isNaN(Number(page))) page = 1; //evita ?page=abc
  if (page < 1) page = 1;

  // 1. Obtener los productos de la base de datos
  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      //! Por género
      where: {
        gender: gender,
      },
    });

    // 2. Solo cuenta el total de los productos con el filtro
    // todo
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    });
    // Calcula el total de páginas
    const totalPages = Math.ceil(totalCount / take);

    // tengo que aplanar como lo establece la interfaz. images: string[]
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.productImages.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error('No se pudo cargar los productos');
  }
};
