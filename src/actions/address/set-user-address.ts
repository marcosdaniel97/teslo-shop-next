'use server';

import type { Address } from '@/interfaces';
import { prisma } from '@/lib/prisma';

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo grabar la dirección',
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    console.log({ userId });
    // buscamos si existe la direccion en la base de datos
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    };

    // Si no existe la direccion en la bd la creamos en la bd
    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }

    // Actualizamos si existe ya en la bd
    const updatedAdress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });
    return updatedAdress;
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo grabar la dirección');
  }
};
