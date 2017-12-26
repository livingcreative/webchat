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