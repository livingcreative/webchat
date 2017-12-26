<template>
  <div class="inner-messages my">
    <div><small>{{ message.time }}</small></div>
    <div v-for="msg in message.inner" :key="msg">
      <div class="message my" v-html="msg"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  name: 'my-message'
}
</script>

<style>
.message.my {
  background-color: #fff;
  border-top-right-radius: 0px;
}
.inner-messages.my {
  text-align: right;
}
</style>
