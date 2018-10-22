<template>
    <div class="inner-messages my">
        <div><small>{{ messageTime(message.time) }}</small></div>
        <message-block class="my" :messages="message.inner"></message-block>
    </div>
</template>

<script>
import MessageBlock from './MessageBlock'
import { Messages } from '../../modules/messages'


export default {
    components: { MessageBlock },
    props: ['message'],
    name: 'my-message',
    methods: {
        messageTime: Messages.messageTime
    }
}
</script>

<style lang="scss">
.inner-messages {
    &.my {
        text-align: right;
    }
    .my {
        .message {
            background-color: #fff;
            border-top-right-radius: 0px;
            margin-left: 100px;
            > .text {
               text-align: left;
            }
            .attachment .button:not(.is-loading) {
                display: none;
            }
        }
    }
}
</style>
