export const ATT_IMAGE = 0
export const ATT_FILE = 1

export function isImageAttachment(att) {
  return att.type === ATT_IMAGE
}

export function isFileAttachment(att) {
  return att.type === ATT_FILE
}

export function messageToHTML(message) {
  return message.replace("\n", "<br>")
}

export function messageTime(time) {
  let hours = time.getHours()
  let postfix = hours >= 12 ? " PM" : " AM"

  if (hours === 0) {
    hours = 12
  } else if (hours > 12) {
    hours -= 12
  }

  return hours + ":" + time.getMinutes() + postfix
}