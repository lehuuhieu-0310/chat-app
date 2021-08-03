const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })

const $messageForm = document.querySelector('#message-form')
const $messageInput = document.querySelector('input')
const $messageButton = document.querySelector('button')

const $locationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

// Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const roomNameTemplate = document.querySelector('#roomName-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username, room)

const scrollToBottom = () => {
    $messages.scrollTop = $messages.scrollHeight
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createAt: moment(message.createAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    scrollToBottom()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createAt: moment(message.createAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    scrollToBottom()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    const roomName = Mustache.render(roomNameTemplate, {
        room
    })
    document.querySelector('#roomName').innerHTML = roomName
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', e => {
    e.preventDefault()

    $messageButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, () => {
        $messageInput.value = ''
        $messageInput.focus()
        $messageButton.removeAttribute('disabled')

        console.log('Message delivered!')
    })
})

document.querySelector('#send-location').addEventListener('click', e => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})

socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})