<template>
  <div class="message-list">
    <div v-for="message in messages" :key="message.user.id" class="message-block">
      <my-message v-if="message.user.itsme" :message="message"></my-message>
      <party-message v-else :message="message"></party-message>
    </div>
  </div>
</template>

<script>
import PartyMessage from './PartyMessage'
import MyMessage from './MyMessage'

export default {
  components: {
    'party-message': PartyMessage,
    'my-message': MyMessage
  },
  props: ['messages'],
  name: 'message-list'
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
