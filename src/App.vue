<template>
    <component :is="view" :chat="chat"></component>
</template>

<script>
import 'font-awesome/css/font-awesome.css'
import 'bulma/css/bulma.css'
import ChatUI from './components/ChatUI'
import Login from './components/Login'
import EventBus from './modules/events'

export default {
    components: { ChatUI, Login },
    name: 'app',

    mounted() {
        EventBus.$on('logged-in', chat => { this.chat = chat; this.view = ChatUI })
        EventBus.$on('logged-out', chat => { this.chat = {}; this.view = Login })
    },

    data() {
        return {
            view: Login,
            chat: {}
        }
    }
}
</script>

<style>
html {
    overflow: hidden;
}
.button[disabled], .input[disabled] {
    cursor: default;
}
.avatar {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
}
.message {
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 4px;
    display: inline-block;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
.inner-messages {
    margin-bottom: 10px;
}
.chat-container {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
}
:hover::-webkit-scrollbar-thumb {
    background-color: #ccc;
}
::-webkit-scrollbar-track {
    background: none;
}
</style>
