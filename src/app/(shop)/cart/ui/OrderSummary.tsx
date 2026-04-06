'use client';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

export const OrderSummary = () => {
  
  const router = useRouter()
  const [loaded, setLoaded] = useState(false);

  const cart = useCartStore((state) => state.cart);

  const { itemsInCart, subTotal, tax, total } = useMemo(() => {
    const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    const subTotal = cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    const tax = subTotal * 0.15;
    const total = subTotal + tax;

    return { itemsInCart, subTotal, tax, total };
  }, [cart]);

  /* const { itemsInCart, total, subTotal, tax } = useCartStore(
    ((state) => state.getSummaryInformation()
  ); */
  //const { itemsInCart, total, subTotal, tax } = getSummaryInformation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
