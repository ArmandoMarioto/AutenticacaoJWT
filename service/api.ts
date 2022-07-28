import axios, { AxiosError } from "../node_modules/axios/index";
import { parseCookies, setCookie } from "nookies";
interface AxiosErrorResponse {
  code?: string;
}
let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();
        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;
        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("refresh", { refreshToken })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, "nextauth.token", token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
              });
              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                }
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              failedRequestQueue.forEach((req) => req.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((req) => req.onFailure(err));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject((err) => console.error(err));
            },
          });
        });
      } else {
        //deslogar usuario
      }
    }
  }
);
