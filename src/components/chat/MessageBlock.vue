<template>
  <div>
    <div v-for="(msg, index) in messages" :key="index">
      <div class="attachments" v-for="(att, index) in msg.attachments" :key="index">
        <div class="message">
          <i class="fa" :class="{ 'fa-file': isFileAttachment(att), 'fa-image': isImageAttachment(att) }"></i>
          <span>{{ att.name }}</span>
          <a v-if="!att.completed" class="button" :class="{ 'is-loading': att.downloading }" @click.prevent="downloadAttachment(att)"><i class="fa fa-download"></i></a>
          <i v-if="att.completed" class="fa fa-check"></i>
        </div>
      </div>
      <div class="message" v-if="msg.text.length > 0"><div v-html="messageToHTML(msg.text)"></div></div>
    </div>
  </div>
</template>

<script>
import { isFileAttachment, isImageAttachment, messageToHTML } from '../../modules/messages'

export default {
  props: ['messages'],
  name: 'message-block',
  methods: {
    messageToHTML,
    isFileAttachment,
    isImageAttachment,

    downloadAttachment(att) {
      this.$set(att, 'downloading', true)
      setTimeout(
        () => {
          this.$delete(att, 'downloading')
          this.$set(att, 'completed', true)
        },
        2000
      )
    }
  }
}
</script>

<style>
.attachments .message > *:not(:first-child) {
  margin-left: 5px;
}
.attachments .message > i:first-child {
  color: #aaa;
}
.attachments .message > .button {
  border: none;
  background: none;
  color: #8ac;
  width: 24px;
  height: 24px;
}
.attachments .message > .button:hover {
  background: #8cf;
  color: #fff;
  border-radius: 12px;
}
</style>
