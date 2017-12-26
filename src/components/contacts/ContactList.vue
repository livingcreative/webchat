<template>
  <div>
    <contact-item
        v-for="contact in contacts"
        :contact="contact"
        :key="contact.id">
    </contact-item>
  </div>
</template>

<script>
import ContactItem from './ContactItem'

export default {
  components: { 'contact-item': ContactItem },
  name: 'contact-list',
  props: ['contacts']
}
</script>

<style>

</style>
