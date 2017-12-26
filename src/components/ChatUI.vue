<template>
  <div class="chat-ui" :class="{ 'contacts-active': contactsActive }">

    <div class="header">
      <div class="contacts-toggle" @click="contactsActive = !contactsActive">
        <div></div><div></div><div></div>
      </div>
      <div class="chat-info">
        <div>{{ chatName }}</div>
        <div>This chat is awesome!</div>        
      </div>
      <div class="menu">
        <div class="dropdown-background" :class="{ 'is-active': menuActive }" @click="menuClick()"></div>
        <div class="dropdown is-right" :class="{ 'is-active': menuActive }">
          <div class="dropdown-trigger">
            <div class="menu-btn" :class="{ 'is-active': menuActive }" @click="menuClick()">
              <ul><li></li><li></li><li></li></ul>
            </div>
          </div>
          <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a @click.prevent="menuClick()" class="dropdown-item">Dropdown item</a>
              <a @click.prevent="menuClick()" class="dropdown-item">Other dropdown item</a>
              <a @click.prevent="menuClick()" class="dropdown-item">Other dropdown item</a>
              <hr class="dropdown-divider">
              <a @click.prevent="logOut()" class="dropdown-item">Log out</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contacts">
      <div class="media you">
        <div class="media-left">
          <div class="avatar"><span>You</span></div>
        </div>
        <div class="media-content contact-info">
          <div class="no-wrap"><strong>{{ firstName }} {{ lastName }}</strong></div>
          <div class="no-wrap"></div>
        </div>
      </div>
      <div class="contact-container">
        <contact-list :contacts="contacts"></contact-list>
      </div>
    </div>

    <div class="messages">
      <message-list :messages="messages" class="chat-area"></message-list>

      <div class="input-area">
        <div class="chat-container input-controls">
          <div>
            <div>
              <div v-if="attachments.length > 0" class="attachments">
                <div v-for="(att, index) in attachments" :key="index" class="attachment">
                  <i class="fa" :class="{ 'fa-file': isFileAttachment(att), 'fa-image': isImageAttachment(att) }"></i>
                  <span>{{ att.name }}</span>
                  <button class="delete" @click="removeAttachment(index)"></button>
                </div>
              </div>
              <textarea class="textarea" rows="3" placeholder="Type some text" v-model="message"></textarea>
            </div>
            <div>
              <ul class="input-buttons">
                <li @click="smileClick()"><i class="fa fa-smile-o"></i></li>
                <li class="file">
                  <label class="file-label">
                    <input type="file" class="file-input" accept="image/*" @change="imageChoosen($event)">
                    <i class="fa fa-picture-o"></i>
                  </label>
                </li>
                <li class="file">
                  <label class="file-label">
                    <input type="file" class="file-input" @change="fileChoosen($event)">
                    <i class="fa fa-paperclip"></i>
                  </label>
                </li>
                <li class="send-btn" @click="sendMessage()"><i class="fa fa-arrow-right"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactList from './contacts/ContactList'
import MessageList from './chat/MessageList'
import EventBus from '../modules/events'
import Auth from '../modules/auth'
import SocketAPI from '../modules/sockets'
import { WebRTCSender } from '../modules/webrtc'
import { ATT_IMAGE, ATT_FILE, isFileAttachment, isImageAttachment } from '../modules/messages'

export default {
  components: { ContactList, MessageList },
  props: ['chat'],
  name: 'chat-ui',

  methods: {
    menuClick() {
      this.menuActive = !this.menuActive
    },

    logOut() {
      Auth.Logout()
      this.chatName = ""
      this.myid = ""
      EventBus.$emit('logged-out')
    },

    isFileAttachment,
    isImageAttachment,

    removeAttachment(index) {
      this.attachments.splice(index, 1)
    },

    smileClick() {
      /*
      EventBus.$emit(
        'message-arrived',
        {
          time: new Date(),
          userId: Math.floor(Math.random() * 5 + 1),
          message: "Hey! This is incoming message from server!"
        }
      )
      */
    },

    attachmentId() {
      let result = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var n = 0; n < 32; n++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))

      }

      return result
    },

    attachFiles(type, picker) {
      for (var n = 0; n < picker.files.length; ++n) {
        const file = picker.files.item(n)
        this.attachments.push({
          id: this.attachmentId(),
          type: type,
          name: file.name,
          size: file.size,
          file: file
        })
      }
      picker.value = null
    },

    imageChoosen(e) {
      this.attachFiles(ATT_IMAGE, e.target)
    },

    fileChoosen(e) {
      this.attachFiles(ATT_FILE, e.target)
    },

    sendMessage() {
      let message = this.message.trim()

      if (message.length || this.attachments.length) {
        SocketAPI.send({
          type: 'message',
          message: this.message,
          time: new Date(),
          attachments: this.attachments.map(att => ({
            id: att.id,
            type: att.type,
            name: att.name,
            size: att.size
          }))
        })

        EventBus.$emit(
          'message-arrived',
          {
            time: new Date(),
            userId: this.myid,
            message: this.message,
            attachments: this.attachments.map(att => {
              let result = {
                id: att.id,
                type: att.type,
                name: att.name,
                size: att.size
              }
              if (att.type === ATT_IMAGE) {
                result.downloading = true
                result.src = window.URL.createObjectURL(att.file)
              }
              return result
            }),
            justsent: true
          }
        )

        for (var att of this.attachments) {
          this.published.push(att)
        }

        this.message = ""
        this.attachments = []
      }
    }
  },

  mounted() {
    EventBus.$on(
      'message-arrived',
      message => {
        const itsme = message.userId === this.myid
        const user = itsme ? null : this.contacts[message.userId]

        // TODO: remove this return, find a way to check send confirmation
        if (itsme && !message.justsent) {
          return
        }

        let lastChatMessage = this.messages.length > 0 ? this.messages[this.messages.length - 1] : null

        const messageToPut = {
          time: message.time,
          text: message.message,
          attachments: message.attachments
        }

        if (lastChatMessage === null || lastChatMessage.user.id !== message.userId) {
          lastChatMessage = {
            user: {
              id: message.userId,
              itsme: itsme
            },
            time: message.time,
            inner: [ messageToPut ]
          }

          if (user) {
            lastChatMessage.user.firstName = user.firstName
            lastChatMessage.user.lastName = user.lastName
          }

          this.messages.push(lastChatMessage)
        } else {
          const sendconfirmation = 
            !message.justsent && lastChatMessage.inner.length > 0 &&
            lastChatMessage.inner[lastChatMessage.inner.length - 1].time.getTime() === message.time.getTime()

          if (sendconfirmation) {
            return
          }

          lastChatMessage.inner.push(messageToPut)
        }

        if (user) {
          user.lastMessage = message.message
        }

        EventBus.$emit('update-message-list')
      }
    )

    EventBus.$on(
      'user-joined',
      user => {
        this.$set(
          this.contacts, user.userId,
          {
            firstName: user.firstName,
            lastName: user.lastName,
            lastMessage: ""
          }
        )
      }
    )

    EventBus.$on(
      'user-left',
      user => {
        this.$delete(this.contacts, user.userId)
      }
    )

    EventBus.$on(
      'webrtc-request',
      data => {
        new WebRTCSender(this.published.find(pub => pub.id === data.uid))
      }
    )

    SocketAPI.connect(this.myid)

    EventBus.$emit('update-message-list', true)
  },

  destroyed() {
    SocketAPI.disconnect()

    EventBus.$off('message-arrived')
    EventBus.$off('user-joined')
    EventBus.$off('user-left')
  },

  data() {
    return {
      chatName: this.chat.chatName,
      myid: this.chat.myid,
      firstName: this.chat.firstName,
      lastName: this.chat.lastName,

      contactsActive: true,
      menuActive: false,

      message: "",
      attachments: [],
      published: [],

      contacts: this.chat.contacts,
      messages: this.chat.messages.reduce((res, val) => {
        let user = res.find(value => value.user.id === val.user.id)
        if (!user) {
          user = {
            user: {
              id: val.user.id,
              firstName: val.user.firstName,
              lastName: val.user.lastName
            },
            time: new Date(val.time),
            inner: []
          }
          res.push(user)
        }
        
        user.inner.push({ text: val.message, attachments: val.attachments })

        return res
      }, [])
    }
  }
}
</script>

<style>
.chat-ui {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}

.header {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 80px;
  background-color: #444;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  justify-content: space-between;
}

.contacts {
  position: absolute;
  left: 0;
  top: 80px;
  width: 0;
  bottom: 0;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-flow: column;
}

.chat-ui.contacts-active .contacts {
  width: auto;
  right: 0;
}

.messages {
  position: absolute;
  left: 0;
  top: 80px;
  bottom: 0;
  right: 0;
  background-color: #eaeaea;
  display: flex;
  flex-direction: column;
}

.chat-ui.contacts-active .messages {
  left: auto;
  width: 0;
}

@media screen and (min-width: 768px) {
  .chat-ui.contacts-active .contacts {
    width: 300px;
  }
  .chat-ui.contacts-active .messages {
    left: 300px;
    width: auto;
  }
}


.contacts-toggle {
  display: inline-flex;
  width: 50px;
  height: 50px;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  padding: 10px;
}

.contacts-toggle div {
  height: 4px;
  background-color: #fff;
}

.chat-info {
  overflow: hidden;
  flex-shrink: 100;
  display: inline-block;
  color: #fff;
  padding: 0 15px;
}

@media screen and (min-width: 768px) {
  /*.chat-ui:not(.contacts-active) .chat-info {
    flex-grow: 100;
    max-width: 800px;
  }*/

  .chat-ui.contacts-active .chat-info {  
    position: absolute;
    left: 300px;
  }
}

.chat-info div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.chat-info div:first-child {
  font-size: 1.25em;
}
.chat-info div:last-child {
  font-size: 0.75em;
  color: #aaa;
}

.menu {
  display: inline-block;
  margin: 9px;
}

.dropdown-background {
  display: none;
}

.dropdown-background.is-active {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: block;
}

.menu-btn {
  width: 32px;
  height: 32px;
  text-align: center;
}

.menu-btn li {
  display: inline-block;
  width: 4px;
  height: 4px;
  border: #ccc solid 1px;
  background-color: #fff;
  margin-right: 5px;
}

.menu-btn li:last-child {
  margin-right: 0px;
}

.menu-btn:hover {
  background-color: #ececec;
}

.menu-btn.is-active {
  background-color: #8cf;
}

.menu-btn.is-active li {
  border-color: #24c;
}


.you {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(219, 219, 219, 0.5);
  overflow: hidden;
}

.chat-ui.contacts-active .you {
  padding: 15px;
}

.you .avatar {
  border: 1px solid #ccc;
  background-color: #ececec;
}

.you .avatar > span {
  font-size: 0.75em;
  color: #888;
}

.contact-container {
  overflow-x: hidden;
  overflow-y: scroll;
}


.chat-area {
  overflow-x: hidden;
  overflow-y: scroll;
  flex-grow: 100;
  background-color: #f8f8f8;
}

.input-area {
  padding: 1rem 0;
}

.input-controls {
  padding: 0 15px;
}

.input-controls > div {
  display: flex;
}

.input-controls > div > div:first-child {
  flex-grow: 100;
}

.input-controls > div > div:last-child {
  display: flex;
  align-items: flex-end;
}

.input-controls .attachments {
  margin: -2px;
  margin-bottom: 10px;
}

.input-controls .attachment {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 2px 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2)
}

.input-controls .attachment {
  margin: 2px 2px;
}

.input-controls .attachment > * {
  margin: 2px 5px;
}

.input-buttons {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

.input-buttons > li {
  color: #8ac;
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-left: 10px;
  border-radius: 15px;
  text-align: center;
  line-height: 25px;
}

.input-buttons > li:hover {
  color: #fff;
  background-color: #8cf;
}

.input-buttons > li > i {
  vertical-align: middle;
}

.input-buttons > li.file {
  display: flex;
  justify-content: center;
}

.input-buttons > li > .file-label {
  justify-content: center;
  align-items: center;
}

.input-buttons .file-input {
  display: none;
}

li.send-btn {
  color: #8ac;
  background-color: #eaeaea;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  line-height: 33px;
}


.column {
  padding: 0;
}
</style>
