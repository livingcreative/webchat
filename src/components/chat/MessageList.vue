<template>
  <div>
    <div class="message-list chat-container">
      <div v-for="message in messages" :key="message.time.getTime()" class="message-block">
        <my-message v-if="message.user.itsme" :message="message"></my-message>
        <party-message v-else :message="message"></party-message>
      </div>
    </div>
  </div>
</template>

<script>
import PartyMessage from './PartyMessage'
import MyMessage from './MyMessage'
import EventBus from '../../modules/events.js'

export default {
  components: { 'party-message': PartyMessage, 'my-message': MyMessage },
  props: ['messages'],
  name: 'message-list',

  mounted() {
    EventBus.$on('update-message-list', () => {
      let el = this.$el
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        this.$nextTick(() => { el.scrollTop = el.scrollHeight })
      }
    })
  }
}
</script>

<style>
.message-list {
  padding-top: 1rem;
}
.message-block {
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
