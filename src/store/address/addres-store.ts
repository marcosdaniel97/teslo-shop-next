// aqui se crea un estado global para guardar la dirección y la guarda en el navegador
import { create } from 'zustand'; // crea el store
import { persist } from 'zustand/middleware'; // hace que los datos se guarden en el localStorage

// esta es la interfaz del estado
interface State {
  // objeto con datos del envío
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };

  // Methods
  // función para actualizar la dirección
  setAddress: (address: State['address']) => void; // se le dice que use el mismo tipo que address
}

// aqui creamos un hook personalizado
export const useAddressStore = create<State>()(
  // persist envuelve el store para que se guarde en el navegador
  persist(
    // Zustand provee set para actualizar el estado, get para leer el estado actual
    (set, get) => ({
      address: {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        postalCode: '',
        city: '',
        country: '',
        phone: '',
      },
      setAddress: (address) => {
        set({ address }); // no hace merge profundo, reemplaza todo
      },
    }),
    {
      name: 'address-storage',
    }
  )
);
