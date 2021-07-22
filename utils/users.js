const users = []

const addUser = ({ id, username, room }) => {

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = id => {
    const index = users.findIndex(user => user.id === id)

    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = id => {
    return users.find(user => user.id === id)
}

const getUserInRoom = room => {
    return users.filter(user => user.room === room)
}

// addUser({
//     id: 22,
//     username: 'hieu22',
//     room: 'hieupro'
// })

// addUser({
//     id: 23,
//     username: 'hieu23',
//     room: 'hieupro'
// })

// addUser({
//     id: 24,
//     username: 'hieu24',
//     room: 'hieupro'
// })

// const user = getUser(24)
// console.log(user)

// const userList = getUserInRoom('hieupro')
// console.log(userList)

// console.log(users)

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}