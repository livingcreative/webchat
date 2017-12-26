import axios from 'axios'
import { API, API_LOGIN, API_LOGIN_ATTEMPT, API_LOGOUT } from './api'

function Auth() {
    this.authenticated = false
    this.user = {}
}

Auth.prototype.CheckLogin = function(login) {
    return new Promise((resolve, reject) => {
        API.post(API_LOGIN_ATTEMPT, { id: login })
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

Auth.prototype.Login = function(login, firstName, lastName) {
    return new Promise((resolve, reject) => {
        API.post(API_LOGIN, { id: login, firstName: firstName, lastName: lastName })
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

Auth.prototype.Logout = function() {
    return new Promise((resolve, reject) => {
        API.post(API_LOGOUT)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

export default new Auth()
