import { API, API_LOGIN, API_LOGIN_ATTEMPT, API_LOGOUT } from './api'

class Auth {
    constructor() {
        this.authenticated = false
        this.user = {}
    }

    CheckLogin(login) {
        console.debug(`AUTH: CheckLogin ${login}`)
        return API.post(API_LOGIN_ATTEMPT, { id: login })
    }

    Login(login, firstName, lastName) {
        console.debug('AUTH: Login')
        return API.post(API_LOGIN, { id: login, firstName: firstName, lastName: lastName })
    }

    Logout() {
        console.debug('AUTH: Logout')
        return API.post(API_LOGOUT)
    }
}

export default new Auth()
