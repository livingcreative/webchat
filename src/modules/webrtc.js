import SocketAPI from './sockets'

export class WebRTCReceiver {
    constructor(att, eventCallback) {
        this.connection = new RTCPeerConnection()
        this.channel = null
        this.candidates = []

        this.buffer = []
        this.received = 0

        this.connection.onicecandidate = event => {
            console.debug('RTC ICE ', event.candidate)

            if (!event.candidate) {
                return
            }

            if (!this.connection.remoteDescription.type) {
                console.debug('RTC RCV delaying ICE')
                this.candidates.push(event.candidate)
                return
            }

            this.connection.addIceCandidate(event.candidate)
        }

        this.connection.ondatachannel = event => {
            this.channel = event.channel
            this.channel.binaryType = 'arraybuffer'

            this.channel.onmessage = event => {
                this.buffer.push(event.data)            
                this.received += event.data.byteLength

                if (this.received === att.size) {
                    console.debug('RTC RECEIVED')

                    eventCallback(new window.Blob(this.buffer))

                    this.channel.close()
                    this.connection.close()
                }
            }

            this.channel.onopen = () => console.debug('RCV STATUS: ', this.channel.readyState)
            this.channel.onclose = () => console.debug('RCV STATUS: ', this.channel.readyState)
        }

        SocketAPI.expect({ type: 'webrtc-ready', uid: att.id }, 'webrtc-description')
            .then(data => {
                console.debug('RTC READY ', data)
                return this.connection.setRemoteDescription(data.desc)
            })
            .then(() => {
                console.debug('RTC CREATE ANSWER')

                this.candidates.forEach(
                    c => this.connection.addIceCandidate(c)
                )

                return this.connection.createAnswer()
            })
            .then(answer => {
                console.debug('RTC ANSWER ', answer)
                return this.connection.setLocalDescription(answer)
            })
            .then(() => {
                console.debug('RTC SENDING RCV DESC')
                SocketAPI.send({ type: 'webrtc-description', uid: att.id, desc: this.connection.localDescription })
            })
    }
}

export class WebRTCSender {
    constructor(att) {
        this.connection = new RTCPeerConnection()
        this.channel = this.connection.createDataChannel('channel')
        this.channel.binaryType = 'arraybuffer'
        this.candidates = []

        this.connection.onicecandidate = event => {
            console.debug('RTC ICE ', event.candidate)

            if (!event.candidate) {
                return
            }

            if (!this.connection.remoteDescription.type) {
                console.debug('RTC SND delaying ICE')
                this.candidates.push(event.candidate)
                return
            }

            this.connection.addIceCandidate(event.candidate)
        }

        this.channel.onopen = () => {
            console.debug('SND STATUS: ', this.channel.readyState)

            if (this.channel.readyState !== 'open') {
                return
            }

            const senddata = {
                sent: 0,
                total: att.file.size,
                connection: this.connection,
                channel: this.channel
            }

            function sendChunk() {
                const reader = new FileReader()
                let left = senddata.total - senddata.sent
                if (left > 65536) {
                    left = 65536
                }
                reader.onload = () => {
                    //console.log('RTC SENT SLICE: ', senddata.sent, ' ', senddata.total)

                    senddata.sent += left
                    senddata.channel.send(reader.result)


                    if (senddata.sent < senddata.total) {
                        setTimeout(sendChunk, 0)
                    } else {
                        console.debug('RTC SENT')
                    }
                }

                reader.readAsArrayBuffer(att.file.slice(senddata.sent, senddata.sent + left))
            }

            setTimeout(sendChunk, 0)
        }
        this.channel.onclose = () => {
            console.debug('SND STATUS: ', this.channel.readyState)

            this.channel.close()
            this.connection.close()
        }

        this.connection.createOffer()
            .then(offer => {
                console.debug('RTC OFFER ', offer)
                return this.connection.setLocalDescription(offer)
            })
            .then(() => {
                console.debug('RTC SENDING SND DESC ')
                return SocketAPI.expect({ type: 'webrtc-description', uid: att.id, desc: this.connection.localDescription }, 'webrtc-description')
            })
            .then(data => {
                console.debug('RTC RCV DESC ARRRIVED ', data)
                return this.connection.setRemoteDescription(data.desc)
            })
            .then(() => {
                console.debug('RTC SND DESC SET')
                this.candidates.forEach(c => this.connection.addIceCandidate(c))
            })
    }
}
