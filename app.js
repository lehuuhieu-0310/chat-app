const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const port = 3000
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '/public')))

let count = 0

io.on('connection', (socket) => {
    console.log('WebSocket connect successfully')

    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++
    //     io.emit('countUpdated', count)
    // })

    socket.emit('message', 'Welcome !')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', message => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})