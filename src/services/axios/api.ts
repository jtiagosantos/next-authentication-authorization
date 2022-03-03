import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  HeadersDefaults,
  AxiosError,
} from 'axios';

import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../../contexts/AuthContext';

interface SmartAxiosDefaults<D = any>
  extends Omit<AxiosRequestConfig<D>, 'headers'> {
  headers: HeadersDefaults & AxiosRequestHeaders;
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`,
  },
});

export const apiDefaults = api.defaults as SmartAxiosDefaults;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const { 'nextauth.refreshToken': refreshToken } = cookies;

        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/refresh', {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;

              const THIRTY_DAYS = 60 * 60 * 24 * 30;

              setCookie(undefined, 'nextauth.token', token, {
                maxAge: THIRTY_DAYS,
                path: '/',
              });
              setCookie(
                undefined,
                'nextauth.refreshToken',
                response.data.refreshToken,
                {
                  maxAge: THIRTY_DAYS,
                  path: '/',
                },
              );

              apiDefaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token),
              );
              failedRequestsQueue = [];
            })
            .catch((error) => {
              failedRequestsQueue.forEach((request) =>
                request.onFailure(error),
              );
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      } else {
        signOut();
      }
    }

    return Promise.reject(error);
  },
);
