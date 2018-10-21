<template>
    <div class="inner-messages my">
        <div><small>{{ messageTime(message.time) }}</small></div>
        <message-block class="my" :messages="message.inner"></message-block>
    </div>
</template>

<script>
import MessageBlock from './MessageBlock'
import { messageTime } from '../../modules/messages'


export default {
  components: { MessageBlock },
  props: ['message'],
  name: 'my-message',
  methods: { messageTime }
}
</script>

<style>
.my .message {
    background-color: #fff;
    border-top-right-radius: 0px;
    margin-left: 100px;
}
.inner-messages.my {
    text-align: right;
}
.my .message > .text {
    text-align: left;
}
.my .message .attachment .button:not(.is-loading) {
    display: none;
}
</style>
