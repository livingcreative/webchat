<template>
    <div class="media">
        <div class="media-left">
            <avatar :contact="message.user"></avatar>
        </div>
        <div class="media-content inner-messages">
            <div><small>
              {{ message.user.firstName }}
              {{ message.user.lastName }}, {{ messageTime(message.time) }}
            </small></div>
            <message-block class="party" :messages="message.inner" :user="message.user.id"></message-block>
        </div>
    </div>
</template>

<script>
import Avatar from '../common/Avatar'
import MessageBlock from './MessageBlock'
import { Messages } from '../../modules/messages'

export default {
    components: { Avatar, MessageBlock },
    props: ['message'],
    name: 'party-message',
    methods: {
        messageTime: Messages.messageTime
    }
}
</script>

<style>
.party .message {
    background-color: #ececec;
    border-top-left-radius: 0px;
    margin-right: 30px;
}
</style>
