const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUserInRoom, getUser } = require('./utils/users')

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '/public')))


io.on('connection', (socket) => {
    console.log('WebSocket connect successfully')

    // socket.emit: send an event to a specific client
    // io.emit: send event to every connected client
    // socket.broadcast.emit: send an event to every connected client except for this one

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome !'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        // io.emit('message', generateMessage(message))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendLocation', (croods, callback) => {
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${croods.latitude},${croods.longitude}`))
        // io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${croods.latitude},${croods.longitude}`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }

    })

})


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})