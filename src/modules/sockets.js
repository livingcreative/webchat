
import { API_SOCKETS_BASE } from './api'
import EventBus from './events'

function SocketAPI() {
    this._socket = {}
}

SocketAPI.prototype.connect = function (id) {
    this._expect = {}

    this._socket = new WebSocket(`ws://${window.location.host}/ws`)

    this._socket.onopen = event => {
        this._socket.send(JSON.stringify({ type: 'login', id: id }))
        console.log("WS connection opened!")
    }

    this._socket.onclose = event => {
        console.log('WS connection closed!')
    }

    this._socket.onmessage = event => {        
        const message = JSON.parse(event.data)

        console.log('WS event received: ', message.type)
        
        const expected = this._expect[message.type + ":" + message.uid]
        if (expected) {
            expected.callback(message, true)
            delete this._expect[message.type + ":" + message.uid]
        }

        switch (message.type) {
            case 'accepted':
                console.log('WS accepted: ', message.data)
                break

            case 'message':
                EventBus.$emit(
                    'message-arrived',
                    {
                      time: new Date(message.time),
                      userId: message.id,
                      message: message.message,
                      attachments: message.attachments
                    }
                )
                break

            case 'joined':
                EventBus.$emit(
                    'user-joined',
                    {
                        userId: message.id,
                        firstName: message.firstName,
                        lastName: message.lastName
                    }
                )
                break

            case 'left':
                EventBus.$emit(
                    'user-left',
                    {
                        userId: message.id
                    }
                )
                break

            case 'webrtc-request':
                EventBus.$emit(
                    'webrtc-request',
                    {
                        uid: message.uid
                    }
                )
                break
        }
    }
}

SocketAPI.prototype.send = function (data) {
    this._socket.send(JSON.stringify(data))
}

SocketAPI.prototype.expect = function (data, type) {
    this.send(data)

    return new Promise((resolve, reject) => {
        this._expect[type + ":" + data.uid] = {
            callback: (data, success) => {
                if (success) {
                    resolve(data)
                } else {
                    reject(data)
                }
            }
        }
    })
}

SocketAPI.prototype.disconnect = function () {
    this._socket.close()
}

export default new SocketAPI()
