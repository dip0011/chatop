const chatform = document.getElementById('chat-form');
const chatMessage = document.querySelector('.right');
// const roomName = document.getElementById('room');
// const userList = document.getElementById('users');


// Get usernaem and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join ChatRoom
socket.emit('JoinRoom', { username, room });

// Get room and users
// socket.on('roomUsers', user => {
//     // outputRoomName(room);
//     outputUsers(user);
// });

socket.on('message', message => {
    // console.log(message);
    outputMessage(message);

    // Scroll Down When new MSG arrives
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message Submit by FrontEnd Chat-form
chatform.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get text from chat TextBox
    const msg = e.target.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear Message from TextBox After Sending it to server
    e.target.msg.value = '';
    e.target.msg.focus();
});

// Output Message To FrontEnd
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.right').appendChild(div);
}

// // Replace Room name according to choosen
// function outputRoomName(room) {
//     roomName.innerHTML = room;
// }

// Add users to FrondEnd
// function outputUsers(user) {
//     const li = document.createElement('li');
//     li.innerText = user;
//     userList.appendChild(li);
// }

// --- Leave Room Button Work ---
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    }
    else {
        // NOthing!!!
    }
});