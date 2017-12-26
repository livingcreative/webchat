<template>
  <div id="app">
    <chat-ui></chat-ui>
  </div>
</template>

<script>
import ChatUI from './components/ChatUI'

export default {
  components: { 'chat-ui' : ChatUI },
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>

</style>
