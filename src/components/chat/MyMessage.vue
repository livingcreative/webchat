<template>
  <div class="inner-messages my">
    <div><small>{{ messageTime(message.time) }}</small></div>
    <div v-for="msg in message.inner" :key="msg">
      <div class="message my"><div v-html="messageToHTML(msg)"></div></div>
    </div>
  </div>
</template>

<script>
import { messageToHTML, messageTime } from '../../modules/messages'

export default {
  props: ['message'],
  name: 'my-message',
  methods: { messageToHTML, messageTime }
}
</script>

<style>
.message.my {
  background-color: #fff;
  border-top-right-radius: 0px;
  margin-left: 100px;
}
.inner-messages.my {
  text-align: right;
}
.message.my>div {
  text-align: left;
}
</style>
