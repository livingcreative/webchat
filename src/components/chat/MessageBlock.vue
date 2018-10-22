<template>
    <div>
        <div v-for="(msg, index) in messages" :key="index">
            <div class="attachments" v-for="(att, index) in msg.attachments" :key="index">
                <div class="message">
                    <div class="attachment">
                        <i class="fa" :class="{ 'fa-file': isFileAttachment(att), 'fa-image': isImageAttachment(att) }"></i>
                        <span v-if="!isFileAttachment(att) || !att.completed">{{ att.name }}</span>
                        <a v-if="isFileAttachment(att) && att.completed"
                            :href="att.href"
                            :style="{ 'display': att.completed ? null : 'none' }"
                            :download="att.name"
                        >
                            {{ att.name }}
                        </a>
                        <a v-if="!att.completed" class="button"
                            :class="{ 'is-loading': att.downloading }"
                            @click.prevent="downloadAttachment(att, user)"
                        >
                            <i class="fa fa-download"></i>
                        </a>
                        <i v-if="att.completed" class="fa fa-check"></i>
                    </div>
                    <img v-if="isImageAttachment(att)"
                        class="preview"
                        :src="att.src"
                        :style="{ 'display': att.completed ? null : 'none' }"
                        :alt="att.name"
                        @load="previewLoaded(att)"
                    >
                    <div class="att-info">File size: {{ sizeToText(att.size) }}</div>
                </div>
            </div>
            <div class="message" v-if="msg.text.length > 0"><div class="text" v-html="messageToHTML(msg.text)"></div></div>
        </div>
    </div>
</template>

<script>
import { Messages } from '../../modules/messages'
import EventBus from '../../modules/events'
import SocketAPI from '../../modules/sockets'
import { WebRTCReceiver } from '../../modules/webrtc'

export default {
    props: ['messages', 'user'],
    name: 'message-block',
    methods: {
        messageToHTML: Messages.messageToHTML,
        isFileAttachment: Messages.isFileAttachment,
        isImageAttachment: Messages.isImageAttachment,

        sizeToText(size) {
            let maxsize = 1
            for (var sz of [" B", " KB", " MB"]) {
                if (size < maxsize * 1024) {
                    return (size / maxsize).toLocaleString(navigator.language, { maximumFractionDigits: 1 }) + sz
                }
                maxsize *= 1024
            }
        },

        async downloadAttachment(att, user) {
            this.$set(att, 'downloading', true)

            let data = await SocketAPI.expect({ type: 'webrtc-start', user: user, uid: att.id }, 'webrtc-accept')

            if (data.result === 'rejected') {
                att.downloading = false // TODO: mark unavailable
            } else {
                console.debug('WEBRTC START READY ', data)
                new WebRTCReceiver(att, blob => {
                    att.downloading = false
                    att.completed = true
                    if (isImageAttachment(att)) {
                        att.src = window.URL.createObjectURL(blob)
                    }
                    if (isFileAttachment(att)) {
                        this.$set(att, 'href', window.URL.createObjectURL(blob))
                    }
                })
            }
        },

        previewLoaded(att) {
            att.downloading = false
            att.completed = true
        }
    }
}
</script>

<style lang="scss">
.attachments {
    .message {
        .attachment > *:not(:first-child) {
            margin-left: 5px;
        }

        > .attachment {
            > i.fa {
                color: #aaa;
            }
            > a.button {
                border: none;
                background: none;
                color: #8ac;
                width: 24px;
                height: 24px;
                &:hover {
                    background: #8cf;
                    color: #fff;
                    border-radius: 12px;
                }
            }
            .att-info {
                text-align: right;
                color: #ccc;
                font-size: 0.75em;
            }
        }

        .preview {
            max-width: 200px;
            margin: 4px 0;
        }
    }
}
</style>
