<template>
  <div id="app">
    <chat-ui></chat-ui>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import 'bulma/css/bulma.css'
import ChatUI from './components/ChatUI'
import Login from './components/Login'
import './assets/style.css'

export default {
  components: { 'chat-ui': ChatUI, 'login': Login },
  name: 'app',
  data() {
    return { }
  }
}
</script>

<style>

</style>
