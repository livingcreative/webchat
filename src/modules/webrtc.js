import SocketAPI from './sockets'

export function WebRTCReceiver(att, eventCallback) {
    this.connection = new RTCPeerConnection()
    this.channel = null
    this.candidates = []

    this.buffer = []
    this.received = 0

    this.connection.onicecandidate = event => {
        console.log('RTC ICE ', event.candidate)

        if (!event.candidate) {
            return
        }

        if (!this.connection.remoteDescription.type) {
            console.log('RTC RCV delaying ICE')
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

            //console.log('RTC RECEIVED: ', this.received, ' of ', att.size)

            if (this.received === att.size) {
                console.log('RTC RECEIVED')

                eventCallback(new window.Blob(this.buffer))

                this.channel.close()
                this.connection.close()
            }
        }

        this.channel.onopen = event => {
            console.log('RCV STATUS: ', this.channel.readyState)
        }
        this.channel.onclose = event => {
            console.log('RCV STATUS: ', this.channel.readyState)
        }
    }

    SocketAPI.expect({ type: 'webrtc-ready', uid: att.id }, 'webrtc-description')
        .then(data => {
            console.log('RTC READY ', data)
            return this.connection.setRemoteDescription(data.desc)
        })
        .then(() => {
            console.log('RTC CREATE ANSWER')

            this.candidates.forEach(
                c => this.connection.addIceCandidate(c)
            )

            return this.connection.createAnswer()
        })
        .then(answer => {
            console.log('RTC ANSWER ', answer)
            return this.connection.setLocalDescription(answer)
        })
        .then(() => {
            console.log('RTC SENDING RCV DESC')
            SocketAPI.send({ type: 'webrtc-description', uid: att.id, desc: this.connection.localDescription })
        })
}

export function WebRTCSender(att) {
    this.connection = new RTCPeerConnection()
    this.channel = this.connection.createDataChannel('channel')
    this.channel.binaryType = 'arraybuffer'
    this.candidates = []

    this.connection.onicecandidate = event => {
        console.log('RTC ICE ', event.candidate)

        if (!event.candidate) {
            return
        }

        if (!this.connection.remoteDescription.type) {
            console.log('RTC SND delaying ICE')
            this.candidates.push(event.candidate)
            return
        }

        this.connection.addIceCandidate(event.candidate)
    }

    this.channel.onopen = event => {
        console.log('SND STATUS: ', this.channel.readyState)

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
                    console.log('RTC SENT')
                }
            }

            //console.log('RTC SENDING SLICE: ', senddata.sent, ' ', senddata.total)

            reader.readAsArrayBuffer(att.file.slice(senddata.sent, senddata.sent + left))
        }

        setTimeout(sendChunk, 0)
    }
    this.channel.onclose = event => {
        console.log('SND STATUS: ', this.channel.readyState)

        this.channel.close()
        this.connection.close()
    }

    this.connection.createOffer()
        .then(offer => {
            console.log('RTC OFFER ', offer)
            return this.connection.setLocalDescription(offer)
        })
        .then(() => {
            console.log('RTC SENDING SND DESC ')
            return SocketAPI.expect({ type: 'webrtc-description', uid: att.id, desc: this.connection.localDescription }, 'webrtc-description')
        })
        .then(data => {
            console.log('RTC RCV DESC ARRRIVED ', data)
            return this.connection.setRemoteDescription(data.desc)
        })
        .then(() => {
            console.log('RTC SND DESC SET')

            this.candidates.forEach(
                c => this.connection.addIceCandidate(c)
            )
        })
}