<template>
  <div>
    <!-- chat top bar -->
    <div class="columns chat-panel top-bar">
      <div class="column is-one-fifth">
        <div class="level you">
          <div class="level-left">
            <div class="avatar"><span>You</span></div>
          </div>
          <div class="level-right">
            <div class="menu-btn">
              <ul><li></li><li></li><li></li></ul>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-four-fifths">
        <div class="level chat-bar">
          <div class="level-left">
            <div class="chat-name">{{ chatName }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- chat main content -->
    <div class="columns chat-panel main-bar">
      <div class="column is-one-fifth contact-container">
        <contact-list :contacts="contacts"></contact-list>
      </div>
      <div class="column is-four-fifths chat-messages">
        <div class="chat-area">
          <message-list :messages="messages" class="chat-container"></message-list>
        </div>
        <div class="input-area">
          <div class="chat-container input-controls">
            <div class="columns chat-panel">
              <div class="column is-three-quarters">
                <textarea class="textarea" rows="3" placeholder="Type some text" v-model="message"></textarea>
              </div>
              <div class="column is-one-quarter input-buttons-container">
                <ul class="input-buttons">
                  <li><i class="fa fa-smile-o"></i></li>
                  <li><i class="fa fa-picture-o"></i></li>
                  <li><i class="fa fa-paperclip"></i></li>
                  <li class="send-btn"><i class="fa fa-arrow-right"></i></li>
                </ul>
              </div>
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

export default {
  components: {
    'contact-list': ContactList,
    'message-list': MessageList
  },

  name: 'chat-ui',

  data() {
    return {
      chatName: "Awesome hero chat",
      message: "",
      contacts: [
        {
          id: "1",
          firstName: "Gordon", lastName: "Freeman",
          lastMessage: "..."
        },
        {
          id: "2",
          firstName: "Doom", lastName: "Guy",
          lastMessage: "Where are demons?"
        },
        {
          id: "3",
          firstName: "Jesse", lastName: "Pinkman",
          lastMessage: "Bitch!"
        },
        {
          id: "4",
          firstName: "Rick", lastName: "Grimes",
          lastMessage: "How many people did you kill?"
        },
        {
          id: "5",
          firstName: "Thomas", lastName: "Anderson",
          lastMessage: "I followed the white rabbit"
        },
        {
          id: "6",
          firstName: "Jessica", lastName: "Jones",
          lastMessage: "Got some booze?"
        },
      ],
      messages: [
        {
          user: {
            id: "1",
            firstName: "Gordon", lastName: "Freeman"
          },
          time: "1:12 PM",
          inner: [
            "..."
          ]
        },
        {
          user: {
            id: "2",
            firstName: "Doom", lastName: "Guy"
          },
          time: "1:27 PM",
          inner: [
            "Give me a gun!",
            "I need to shoot some demons now! I need to shoot some demons now! I need to shoot some demons now! I need to shoot some demons now!",
            "Where are demons?"
          ]
        },
        {
          user: {
            id: "0",
            itsme: true
          },
          time: "1:28 PM",
          inner: [
            "I'm not a demon!",
            "Don't shoot me, I want to live!"
          ]
        },
        {
          user: {
            id: "3",
            firstName: "Jesse", lastName: "Pinkman"
          },
          time: "1:35 PM",
          inner: [
            "I'm not a demon too<br>Don't even try to shoot me!",
            "Bitch!"
          ]
        },
        {
          user: {
            id: "4",
            firstName: "Rick", lastName: "Grimes"
          },
          time: "1:39 PM",
          inner: [
            "Hey, Doom Guy",
            "How many people did you kill?"
          ]
        },
        {
          user: {
            id: "5",
            firstName: "Thomas", lastName: "Anderson"
          },
          time: "1:43 PM",
          inner: ["I followed the white rabbit"]
        },
        {
          user: {
            id: "6",
            firstName: "Jessica", lastName: "Jones"
          },
          time: "1:52 PM",
          inner: ["Got some booze?"]
        },
      ]
    }
  }
}
</script>

<style>
.you {
  padding: 15px;
}
.you .avatar {
  border: 1px solid #ccc;
  background-color: #ececec;
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
.chat-bar {
  background-color: #ececec;
  padding: 15px;
  height: 78px;
}
.chat-name {
  height: 48px;
  font-size: 1.5em;
}
.chat-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.chat-panel, .chat-panel:not(:last-child), .chat-panel:last-child {
  margin: 0;
}
.top-bar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.main-bar {
  position: fixed;
  left: 0;
  top: 78px;
  right: 0;
  bottom: 0;
}
.contact-container {
  overflow-x: hidden;
  overflow-y: scroll;
}
.chat-messages {
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}
.chat-area {
  overflow-x: hidden;
  overflow-y: scroll;
}
.input-area {
  padding: 1rem 0;
}
.input-controls {
  padding: 0 15px;
}
.input-buttons-container {
  position: relative;
}
.input-buttons {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0;
}
.input-buttons>li {
  color: #8ac;
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-left: 10px;
  border-radius: 15px;
  text-align: center;
  line-height: 25px;
}
.input-buttons>li:hover {
  color: #fff;
  background-color: #8cf;
}
.input-buttons>li>i {
  vertical-align: middle;
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
