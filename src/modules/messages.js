export const ATT_IMAGE = 0
export const ATT_FILE = 1

export class Messages {
    static isImageAttachment(att) {
        return att.type === ATT_IMAGE
    }
    
    static isFileAttachment(att) {
        return att.type === ATT_FILE
    }
    
    static messageToHTML(message) {
        return message.replace("\n", "<br>")
    }
    
    static messageTime(time) {
        let hours = time.getHours()
        let postfix = hours >= 12 ? " PM" : " AM"
      
        if (hours === 0) {
            hours = 12
        } else if (hours > 12) {
            hours -= 12
        }
      
        return hours + ":" + time.getMinutes() + postfix
    }
}
