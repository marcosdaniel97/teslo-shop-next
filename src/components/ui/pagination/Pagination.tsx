'use client';
import { generatePaginationNumbers } from '@/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname(); // obtenemos la ruta actual
  const searchParams = useSearchParams(); // obtenemos los parámetros actuales ?page=2 => "2"

  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString; // Ej ?page=abc => currentPage=1 || ?page=3 => currentPage=3

  // si alguien escribe ?page=-5 || ?page=abc
  if (currentPage < 1 || isNaN(+pageString)) {
    redirect(pathname);
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages); // devuelve un array. Ej=[1,2,3,4,5]

  //console.log(allPages);

  // Esta función construye la URL correcta para cada botón
  const createPageUrl = (pageNumber: number | string) => {
    // URLSearchParams es una API nativa de js para trabajar con los parametros (lo que va despues de ?)
    const params = new URLSearchParams(searchParams);

    if (pageNumber === '...') {
      return `${pathname}?${params.toString()}`; // solo devuelve la URL actual: /products?page=2
    }

    if (+pageNumber <= 0) {
      return `${pathname}`; // No agrega page, devuelve la ruta base: "/kid","men",etc
    }

    if (+pageNumber > totalPages) {
      // Siguiente >
      return `${pathname}?${params.toString()}`; // devuelve la ruta en la que nos encontramos pero arriba
    }

    params.set('page', pageNumber.toString()); // modificamos solo el parámetro page = nuevo valor
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex text-center mt-10 mb-32 justify-center">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {allPages.map((page, index) => (
            <li key={page + '-' + index} className="page-item">
              <Link
                className={clsx(
                  'page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none',
                  {
                    'bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700':
                      page === currentPage,
                  }
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
