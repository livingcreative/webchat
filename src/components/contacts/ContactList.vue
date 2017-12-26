<template>
  <div>
    <contact-item
        v-for="(contact, id) in contacts"
        :contact="contact"
        :key="id">
    </contact-item>
  </div>
</template>

<script>
import ContactItem from './ContactItem'

export default {
  components: { ContactItem },
  name: 'contact-list',
  props: ['contacts']
}
</script>

<style>

</style>
