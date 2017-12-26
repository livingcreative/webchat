<template>
  <div class="media">
    <div class="media-left">
      <avatar :contact="message.user"></avatar>
    </div>
    <div class="media-content inner-messages">
      <div><small>{{ message.user.firstName }} {{ message.user.lastName }}, {{ messageTime(message.time) }}</small></div>
      <div v-for="msg in message.inner" :key="msg">
        <div class="message party" v-html="messageToHTML(msg)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '../common/Avatar'
import { messageToHTML, messageTime } from '../../modules/messages'

export default {
  components: { 'avatar': Avatar },
  props: ['message'],
  name: 'party-message',
  methods: { messageToHTML, messageTime }
}
</script>

<style>
.message.party {
  background-color: #ececec;
  border-top-left-radius: 0px;
  margin-right: 30px;
}
</style>
