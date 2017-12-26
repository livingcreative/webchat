<template>
  <div id="app">
    <component :is="view" :chat="chat"></component>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import 'bulma/css/bulma.css'
import ChatUI from './components/ChatUI'
import Login from './components/Login'
import './assets/css/style.css'
import EventBus from './modules/events'

export default {
  components: { ChatUI, Login },
  name: 'app',

  mounted() {
    EventBus.$on(
      'logged-in',
      (chat) => {
        this.chat = chat
        this.view = ChatUI
      }
    )
    EventBus.$on(
      'logged-out',
      (chat) => {
        this.chat = {}
        this.view = Login
      }
    )
  },

  data() {
    return {
      view: Login,
      chat: {}
    }
  }
}
</script>

<style>

</style>
