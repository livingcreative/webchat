<template>
  <div id="app">
    <chat-ui></chat-ui>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import 'bulma/css/bulma.css'
import ChatUI from './components/ChatUI'
import './assets/style.css'

export default {
  components: { 'chat-ui' : ChatUI },
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>

</style>
