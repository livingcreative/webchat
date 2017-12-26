<template>
  <div class="media contact-item">
    <div class="media-left">
      <avatar :contact="contact"></avatar>
    </div>
    <div class="media-content">
      <div><strong>{{ contact.firstName }} {{ contact.lastName }}</strong></div>
      <div class="last-message">{{ contact.lastMessage }}</div>
    </div>
  </div>
</template>

<script>
import Avatar from '../common/Avatar'

export default {
  components: { 'avatar': Avatar },
  name: 'contact-item',
  props: ['contact']
}
</script>

<style>
.contact-item {
  padding-left: 15px;
  padding-right: 15px;
  left: 0px;
  right: 0px;
  overflow: hidden;
}
.media-content {
  position: relative;
}
.last-message {
  position: absolute;
  left: 0px;
  right: 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
