'use client';

import { useSession } from 'next-auth/react';
import { logout } from '@/actions';
import { useUIStore } from '@/store';
import clsx from 'clsx';
import Link from 'next/link';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  // para usar el hoook useSession tuve que crear el Provider y envolver el layout de la app
  const { data: session, status } = useSession();

  const isAuthenticated = !!session?.user;
  //console.log({ isAuthenticated, status });

  const isAdmin = session?.user.role === 'admin';

  const onLogout = async () => {
    await logout();
    window.location.reload();
    closeMenu();
  };

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          'fixed h-screen right-0 top-0 w-full sm:w-[300px] md:w-[400px] p-5  bg-white z-20 shadow-2xl transform transition-all duration-300 overflow-y-auto/*  */',
          {
            // si el menú no esta abierto que muestre la clase
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          className="absolute top-4 right-4 text-[28px] sm:text-[40px] cursor-pointer"
          onClick={closeMenu}
        />

        {/* Input */}
        <div className="relative mt-8 sm:mt-12">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-9 sm:pl-10 py-2 pr-3 border-b-2 text-base sm:text-lg border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Menú -- Esto modificado!!! */}

        <div className="flex flex-col gap-4 sm:gap-6 mt-8">
          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                onClick={() => closeMenu()}
                className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              >
                <IoPersonOutline className="text-[20px] sm:text-[26px]" />
                <span className="ml-3 text-base sm:text-lg">Perfil</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => closeMenu()}
                className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              >
                <IoTicketOutline className="text-[20px] sm:text-[26px]" />
                <span className="ml-3 text-base sm:text-lg">Ordenes</span>
              </Link>
            </>
          )}

          {isAuthenticated && (
            <button
              className="flex w-full items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              onClick={() => {
                onLogout();
                //closeMenu();
              }}
            >
              <IoLogOutOutline className="text-[20px] sm:text-[26px]" />
              <span className="ml-3 text-base sm:text-lg">Salir</span>
            </button>
          )}

          {!isAuthenticated && (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
            >
              <IoLogInOutline className="text-[20px] sm:text-[26px]" />
              <span className="ml-3 text-base sm:text-lg">Ingresar</span>
            </Link>
          )}

          {/* Line separator */}
          <div className="w-full h-px bg-gray-200 opacity-60" />
          {isAdmin && (
            <>
              <Link
                href="/admin/products"
                onClick={() => closeMenu()}
                className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              >
                <IoShirtOutline className="text-[20px] sm:text-[26px]" />
                <span className="ml-3 text-base sm:text-lg">Productos</span>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => closeMenu()}
                className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              >
                <IoTicketOutline className="text-[20px] sm:text-[26px]" />
                <span className="ml-3 text-base sm:text-lg">Ordenes</span>
              </Link>

              <Link
                href="/admin/users"
                onClick={() => closeMenu()}
                className="flex items-center py-2 px-2 sm:px-3 hover:bg-gray-100 rounded transition-all"
              >
                <IoPersonOutline className="text-[20px] sm:text-[26px]" />
                <span className="ml-3 text-base sm:text-lg">Usuarios</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
