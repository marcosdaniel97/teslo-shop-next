export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@/generated/prisma';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    gender: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function GenderByPage({ params, searchParams }: Props) {
  const { gender } = await params;

  const param = await searchParams;

  const page = param.page ? parseInt(param.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }
  /* if (id === 'kids') {
    notFound();
  } */

  // Objeto donde las claves son de tipo Category y el valor string
  const labels: Record<string, string> = {
    men: 'para hombres',
    women: 'para mujeres',
    kid: 'para niños',
    unisex: 'para todos',
  };

  return (
    <>
      <Title
        title={`Artículos ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
