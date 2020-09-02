const users = []

const addUser = ({id, username, room}) => {
    username.trim().toLowerCase()
    room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username & room is required'
        }
    }

    const userExist = users.find((user) => {
        return user.username === username && user.room === room
    })

    if (userExist) {
        return {
            error: 'User is logged in'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const userIndex = users.findIndex((user) => {
        return user.id === id
    })

    if (userIndex !== -1){
        return users.splice(userIndex, 1)
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersByRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersByRoom
}