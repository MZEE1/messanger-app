const socket = io()

const chatForm = document.querySelector('#chat-form')
const chatFormInput = document.querySelector('#chat-input')
const sendButton = document.querySelector('#send-button')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML

// use the query string library to parse the query string from the user login and ignore query prefix

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

// scroll function 

const autoScroll = () => {
    const newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHight = newMessage.offsetHight + newMessageMargin

    const visibleHight = $messages.offsetHight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHight

    if (containerHeight - newMessageHight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

//listening to messages from the server (app.js)

socket.on('message', (message) => {
    console.log(message)

    // use Mustache library to render the message from the form

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') // using the moment library to format the date function
    })

    // display the rendered message from the form on the screen

    $messages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault() // preventing the full page refresh when submitting the form

    //storing the input value by the client to a variable

    const message = e.target.elements.msg.value

    //sending the message from the text input from the client to the server

    socket.emit('chatMessage', message, (message) => {
        chatFormInput.value = '' // clear the text input
        chatFormInput.focus() // move the cursor back to the text input area
        console.log('message delivered', message)
    })
})

// sending the login details to the server (app.js)

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)

        //redirect the user back to the root (index.html) of the site
        location.href = '/'
    }
})