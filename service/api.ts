import axios from "../node_modules/axios/index";
import { parseCookies } from "nookies";

const cookies = parseCookies();

export const api =  axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`,

    }
})