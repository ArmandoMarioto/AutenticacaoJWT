import axios,{AxiosError} from "../node_modules/axios/index";
import { parseCookies, setCookie } from "nookies";
interface AxiosErrorResponse {
    code?: string;
  }
let cookies = parseCookies();

export const api =  axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`,

    }
});

api.interceptors.response.use(response => {
    return response;
}, (error: AxiosError<AxiosErrorResponse>) => {
    if(error.response.status === 401) {
        if(error.response.data?.code === 'token.expired'){
            cookies = parseCookies();
            const {'nextauth.refreshToken': refreshToken} = cookies;
            api.post('refresh', {refreshToken}).then(response => {
                const { token } = response.data;

                setCookie(undefined, 'nextauth.token', token, {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                  })
                  setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                  })

                    api.defaults.headers['Authorization'] = `Bearer ${token}`;
            })
        }else {

        }
    }
})