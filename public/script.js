const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')
const chatMain = document.querySelector('.chat-main')
const sideBar = document.querySelector('.chat-sidebar')
const menuIcon = document.querySelector('.menuIcon')
const inputMessage = document.getElementById('msg')
const typeArea = document.getElementById('typing')


const socket = io()
let mySocket, myMessage, serverResponse


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

outputRoom(room)


socket.emit('joinRoom', { username, room })


socket.on('joinRoom', ({user,room,socketId}) => {
    mySocket = socketId

    socket.on('roomUsers', ({ users }) => {
        outputUsers(users)
    })

    socket.on('message', ({socketId, sender, msg, time}) => {
  
            if (!socketId) serverResponse = true
            else serverResponse = false

            myMessage = socketId === mySocket
            outputMessage(msg, sender, time)
            chatMessages.scrollTop = chatMessages.scrollHeight

    })

})

// socket.on('typing', ({ msg }) => {
//     typeArea.style.display = "block"

//     $("#typing").html(msg).fadeIn(1000)
//     setTimeout(() => {
//             typeArea.style.display = "none"
//     },2000)
    
// })

// msg.addEventListener('keydown', () => {
//     socket.emit('typing',{userName: username})
// })


let click = false
menuIcon.addEventListener('click', () => {
    click = !click
    chatMain.classList.toggle('mobile')
    sideBar.classList.toggle('mobile')
    chatMessages.classList.toggle('mobile')
    if (click) {
        menuIcon.children[0].style.display = "none"
        menuIcon.children[1].style.display = "block"
    } else {
        menuIcon.children[0].style.display = "block"
        menuIcon.children[1].style.display = "none"
    }
})


chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const msg = e.target.elements.msg.value  
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
    socket.emit('chatMessage',msg)
})

function outputRoom(room) {
    roomName.innerHTML = room
}
function outputUsers(users) {
    usersList.innerHTML = ''
    users.forEach(user => {
        usersList.innerHTML +=`<li>${user.username}</li>`
    })
}


function outputMessage(msg,sender,time) {
    const div = document.createElement('div')
    const messageSender = myMessage? 'You' : sender
    
    if (myMessage) {
        div.className = 'message right-side'
    } else if(!serverResponse){
        div.className='message left-side'
    } else {
        div.className = 'message admin-message'
    }
    div.innerHTML = `<p class="meta">${messageSender} <span>${time}</span></p><p>${msg}</p>`
    div.style.order = "1"
    chatMessages.appendChild(div)

}

