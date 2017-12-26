<template>
  <div class="modal is-active login">
    <div class="modal-background"></div>
    <div class="modal-content box">
      <div class="field is-grouped is-grouped-centered">
        <figure class="image logo">
          <img src="../assets/logo.png">
        </figure>
      </div>
      <div class="field">
        <h1 class="title">Welcome to WebRTC chat!</h1>
      </div>
      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="text" placeholder="Nickname" :disabled="loading">
          <span class="icon is-small is-left">
            <i class="fa fa-user"></i>
          </span>
          <span class="icon is-small is-right">
            <i class="fa fa-check"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="text" placeholder="First name" :disabled="loading">
          <span class="icon is-small is-left">
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="text" placeholder="Last name" :disabled="loading">
          <span class="icon is-small is-left">
          </span>
        </p>
      </div>
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <a class="button is-info" :class="{ 'is-loading': loading }" @click="login()">
            Login
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../modules/events.js'

export default {
  name: 'login',

  data () {
    return {
      loading: false
    }
  },

  methods: {
    login() {
      this.loading = true
      setTimeout(
        () => {
          this.loading = false
          EventBus.$emit(
            'logged-in',
            {
              myid: "0", chatName: (["Awesome hero chat", "Dumb chat", "Stop chatting!"])[Math.floor(Math.random() * 3)]
            }
          )
        },
        2000
      )
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
.image.logo {
  width: 290px;
  height: 171px;
}
.modal-background {
  background-color: #ccc;
}
.modal-content.box {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}
</style>
