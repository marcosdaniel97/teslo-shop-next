// restful api que me pide el uso de SessionProvider
import { handlers } from '@/auth.config';

// get y post para realizar las peticiones que el SessionProvider esta buscando
export const { GET, POST } = handlers;
