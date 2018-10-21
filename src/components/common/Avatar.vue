<template>
    <div class="avatar"><span>{{ contactInitials(contact) }}</span></div>
</template>

<script>
export default {
    props: ['contact'],
    name: 'avatar',

    methods: {
        // returns contact's initals for avatar replacement circle
        contactInitials(contact) {
            return (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toLocaleUpperCase()
        }
    }
}
</script>

<style>
.media .avatar {
    font-size: 1.5em;
    color: #fff;
}
</style>
