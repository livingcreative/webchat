<template>
    <div class="media contact-item">
        <div class="media-left">
            <avatar :contact="contact"></avatar>
        </div>
        <div class="media-content contact-info">
            <div class="no-wrap"><strong>{{ contact.firstName }} {{ contact.lastName }}</strong></div>
            <div class="no-wrap">{{ contact.lastMessage }}</div>
        </div>
    </div>
</template>

<script>
import Avatar from '../common/Avatar'

export default {
    components: { Avatar },
    name: 'contact-item',
    props: ['contact']
}
</script>

<style lang="scss">
.contact-item {
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    &:first-child {
        padding-top: 1rem;
    }
    &:last-child {
        padding-bottom: 1rem;
    }
    .media-content {
        position: relative;
    }
    .contact-info {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: absolute;
        left: 76px;
        right: 6px;
    }
}

.no-wrap {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
