const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const {getMessage} = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersByRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New websockets connection!')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})
        
        if (error) {
            callback(error)
        }

        socket.join(user.room)

        socket.emit('message', getMessage('admin:', 'Jambo!'))
        socket.broadcast.to(user.room).emit('message', getMessage('admin', `${user.username} is online`))

        callback()

    })

    // listening to chat message from chat form in chat.js

    socket.on('chatMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', getMessage(user.username,  message))

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message',getMessage('admin', `${user.username} left`))
        }

    })
})


server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})