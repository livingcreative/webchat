<template>
  <div class="columns">
    <div class="column is-one-fifth contact-list">
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
      <div>
        <contact-list :contacts="contacts"></contact-list>
      </div>
    </div>

    <div class="column is-four-fifths chat-content">
      <div class="level chat-bar">
        <div class="level-left">
          <div class="chat-name">{{ chatName }}</div>
        </div>

      </div>
      <div>
        <message-list :messages="messages"></message-list>
        <div>Type a message</div>
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
            "I need to shoot some demons now!",
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
.contact-list {
  padding-right: 0px;
}
.chat-content {
  padding-left: 0px;
}
</style>
