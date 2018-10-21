
import EventBus from './events'

class SocketAPI {
    constructor() {
        this._socket = null
    }

    connect(id) {
        this._expect = {}
    
        this._socket = new WebSocket(`ws://${window.location.host}/ws`)
    
        this._socket.onopen = event => {
            this.send({ type: 'login', id: id })
            console.info("WS connection opened!")
        }
    
        this._socket.onclose = event => {
            console.info('WS connection closed!')
        }
    
        this._socket.onmessage = event => {        
            const message = JSON.parse(event.data)
    
            console.debug('WS event received: ', message.type)
            
            const expected = this._expect[message.type + ":" + message.uid]
            if (expected) {
                expected.callback(message, true)
                delete this._expect[message.type + ":" + message.uid]
            }
    
            switch (message.type) {
                case 'accepted':
                    console.debug('WS accepted: ', message.data)
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
                    EventBus.$emit('user-left', { userId: message.id })
                    break
    
                case 'webrtc-request':
                    EventBus.$emit('webrtc-request', { uid: message.uid })
                    break
            }
        }
    }
    
    send(data) {
        this._socket.send(JSON.stringify(data))
    }
    
    expect(data, type) {
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
    
    disconnect() {
        this._socket.close()
    }
}


export default new SocketAPI()
