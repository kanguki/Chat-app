const express = require('express')
const path = require('path')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const formatMessage = require('./utils/message')
const {userJoin, getRoomUsers, userLeave} = require('./utils/users')

// app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

const botName = 'Admin'
io.on('connection', socket => {
    
    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room) 
        
        socket.emit('joinRoom', { user: user.username, room: user.room, socketId: user.id })
        
        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room)
        })

        socket.emit('message', formatMessage(botName,`Hi ${user.username}, welcome to ChatCord!`))
        
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))
    
        socket.on('chatMessage', message => {
            const { sender, msg, time } = formatMessage(user.username, message)
            io.to(user.room).emit('message', {socketId: user.id, sender, msg, time})
        })

    })

    socket.on('disconnect', () => {  
        const userLeft = userLeave(socket.id)
        if (userLeft) {
            io.to(userLeft.room).emit('message',formatMessage(botName,`${userLeft.username} left`))
            io.to(userLeft.room).emit('roomUsers', { users: getRoomUsers(userLeft.room)})
        }
    })
 
})


const PORT = 9000 || process.env.PORT
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})