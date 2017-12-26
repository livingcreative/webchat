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
import './assets/style.css'
import EventBus from './modules/events.js'

export default {
  components: { 'chat-ui': ChatUI, 'login': Login },
  name: 'app',

  mounted() {
    EventBus.$on(
      'logged-in',
      (chat) => {
        this.chat = chat
        this.view = ChatUI
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
