'use server';
import { prisma } from '@/lib/prisma';

export const getProductsBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        productImages: true,
      },
      where: {
        slug: slug,
      },
    });
    if (!product) return null;
    return {
      ...product,
      images: product.productImages.map((image) => image.url),
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el producto por slug');
  }
};
