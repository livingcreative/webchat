<template>
    <div class="modal is-active login">
        <div class="modal-background"></div>
        <div class="modal-content box">
            <div class="field is-grouped is-grouped-centered">
                <figure class="image logo"><img src="../assets/img/logo.png"></figure>
            </div>
            <div class="field">
                <h1 class="title">Welcome to WebRTC chat!</h1>
            </div>
            <div class="field">
                <p class="control has-icons-left has-icons-right" :class="{ 'is-loading': checking }">
                    <input class="input" type="text" placeholder="Nickname" :disabled="loading" v-model.trim="nickName">
                    <span class="icon is-small is-left">
                        <i class="fa fa-user"></i>
                    </span>
                    <span class="icon is-small is-right">
                        <i class="fa" :class="[nickValidityIcon]"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left">
                    <input class="input" type="text" placeholder="First name" :disabled="loading" v-model.trim="firstName">
                    <span class="icon is-small is-left"></span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left">
                    <input class="input" type="text" placeholder="Last name" :disabled="loading" v-model.trim="lastName">
                    <span class="icon is-small is-left"></span>
                </p>
            </div>
            <div class="field is-grouped is-grouped-right">
                <p class="control">
                    <a class="button is-info" :class="{ 'is-loading': loading }" :disabled="!readyForLogin" @click="login()">
                        Login
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import Auth from '../modules/auth'
import EventBus from '../modules/events'

const NICK_UNKNOWN = 0
const NICK_INVALID = 1
const NICK_VALID = 2

export default {
    name: 'login',

    data() {
        return {
            checking: false,
            loading: false,
            nickValidity: NICK_UNKNOWN,

            nickName: "",
            firstName: "",
            lastName: ""
        }
    },

    created() {
        this.checkLoginDebounced = _.debounce(this.checkLoginDebounced, 500)
    },

    computed: {
        readyForLogin() {
            return this.nickValidity === NICK_VALID && this.firstName.length > 0 && this.lastName.length > 0
        },

        nickValidityIcon() {
            if (this.checking) {
                return ''
            }

            if (this.nickValidity === NICK_VALID) {
                return 'fa-check'
            }

            if (this.nickValidity === NICK_INVALID) {
                return 'fa-times'
            }

            return ''
        }
    },

    watch: {
        nickName() {
            if (this.nickName.length >= 3) {
                this.checkLogin()
            } else {
                this.checkLoginDebounced.cancel()
                this.nickValidity = NICK_UNKNOWN
                this.checking = false
            }
        }
    },

    methods: {
        checkLoginDebounced() {
          Auth.CheckLogin(this.nickName)
            .then(data => { this.nickValidity = NICK_VALID; this.checking = false })
            .catch(error => { this.nickValidity = NICK_INVALID; this.checking = false })
        },

        checkLogin() {
            this.checking = true
            this.checkLoginDebounced()
        },

        login() {
            if (!this.readyForLogin) {
                return
            }

            this.loading = true
            Auth.Login(this.nickName, this.firstName, this.lastName)
                .then(data => {
                    this.loading = false
                    EventBus.$emit(
                        'logged-in',
                        {
                            myid: this.nickName,
                            firstName: this.firstName,
                            lastName: this.lastName,
                            chatName: data.data.chat.title,
                            contacts: data.data.chat.users,
                            messages: data.data.chat.messages
                        }
                    )
                })
                .catch(error => this.loading = false)
        }
    }
}
</script>

<style>
.login .title {
    padding: 20px 0;
    text-align: center;
}
.login .button {
    width: 100px;
}
@media screen and (min-height: 736px) {
    .image.logo {
        width: 290px;
        height: 171px;
    }  
}
@media screen and (max-height: 735px) {
    .image.logo {
        width: 145px;
        height: 85px;
    }  
}
.modal-background {
    background-color: #ccc;
}
.modal-content.box {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    max-height: none;
}
</style>
