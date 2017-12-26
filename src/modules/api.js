export const API_BASE = "http://localhost:3000"
export const API_LOGIN = "/chat/login"
export const API_LOGIN_ATTEMPT = "/chat/login/attempt"
export const API_LOGOUT = "/chat/logout"

import axios from 'axios'

export const API = axios.create({
    baseURL: API_BASE,
    withCredentials: true
})