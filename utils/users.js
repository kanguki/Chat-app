const users = []

function userJoin(id, name, room) {
    const userSplit = name.split('')
    userSplit[0] = userSplit[0].toUpperCase()
    const username = userSplit.join('')
    const user = { id, username, room }
    users.push(user) 
    return user
}
function getRoomUsers(room) {
    return users.filter(user=> user.room === room)
}
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {        
        return users.splice(index,1)[0]
    }
}

module.exports = {
    userJoin,
    getRoomUsers,
    userLeave
}

