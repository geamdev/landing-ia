import { HTTP_STATUS } from '@/constants/http-status';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import { API_URL, API_URL_V2 } from '@/config/site';

// Función para obtener el locale actual
const getCurrentLocale = (): string => {
  // Si estamos en el navegador, intentar obtener el locale de la URL
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const langMatch = pathname.match(/^\/([a-z]{2})\//);
    if (langMatch) {
      return langMatch[1];
    }
  }
  // Fallback a español por defecto
  return 'es';
};

export const DIALER_HTTP_CLIENT = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const DIALER_HTTP_CLIENT_V2 = axios.create({
  baseURL: API_URL_V2,
  withCredentials: true,
});

// Flag to prevent multiple redirects
let isRedirecting = false;
let lastLoginTime = 0;

// Function to reset the redirecting flag
export const resetRedirectingFlag = () => {
  isRedirecting = false;
  console.log('Axios interceptor: Redirect flag reset');
};

// Function to mark successful login
export const markSuccessfulLogin = () => {
  lastLoginTime = Date.now();
  console.log('Axios interceptor: Login marked as successful');
};

// Common request interceptor setup function
const setupRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config: any) => {
      // Agregar el header Accept-Language en cada request sin sobrescribir headers existentes
      const locale = getCurrentLocale();

      // Solo agregar Accept-Language si no existe ya
      if (!config.headers?.['Accept-Language']) {
        (config.headers as Record<string, string>)['Accept-Language'] = locale;
      }

      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// Common response interceptor setup function
const setupResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (
        error.response &&
        error.response.status === HTTP_STATUS.UNAUTHORIZED
      ) {
        const currentPath = window.location.pathname;
        const timeSinceLogin = Date.now() - lastLoginTime;

        console.log('Axios interceptor: 401 detected', {
          currentPath,
          isRedirecting,
          timeSinceLogin,
          isRecentLogin: timeSinceLogin < 5000, // 5 seconds
        });

        // Only set redirecting flag to prevent multiple redirects
        // Let the useSession hook handle the actual logout
        if (
          !isRedirecting &&
          !currentPath.startsWith('/login') &&
          !currentPath.startsWith('/register') &&
          timeSinceLogin > 5000
        ) {
          console.log('Axios interceptor: Setting redirect flag');
          isRedirecting = true;
        }
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both clients
setupRequestInterceptor(DIALER_HTTP_CLIENT);
setupRequestInterceptor(DIALER_HTTP_CLIENT_V2);
setupResponseInterceptor(DIALER_HTTP_CLIENT);
setupResponseInterceptor(DIALER_HTTP_CLIENT_V2);
