//export const dynamic = 'force-static';
export const revalidate = 60;

import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { ProductGrid, Title, Pagination } from '@/components';

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;

  const page = params.page ? parseInt(params.page) : 1;

  // Al cargar la app el servidor arma la respuesta currentPage=1, totalPage=5, products:[12 productos]
  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
