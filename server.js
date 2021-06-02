const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatOp Bot';

// Set static folder public 
app.use(express.static(path.join(__dirname, 'public')));

// Run when user connect on ChatRoom 
io.on('connection', Socket => {

    Socket.on('JoinRoom', ({ username, room }) => {
        const user = userJoin(Socket.id, username, room);

        Socket.join();
        // Welcome current user
        Socket.emit('message', formatMessage(botName, 'Welcome To ChatOp'));

        // Broadcast when a user connects
        Socket.broadcast.emit('message', formatMessage(botName, `<b>${user.username}</b> has joined the chat`));

        // Send users and room info
        // io.emit('roomUsers', `${user.username}`);
    });

    // Listen for chatMessage
    Socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(Socket.id);
        io.emit('message', formatMessage(user.username, msg));
    });

    // Runs when a user disconnect
    Socket.on('disconnect', () => {
        const user = userLeave(Socket.id);
        if (user) {
            io.emit('message', formatMessage(botName, `<b>${user.username}</b> has left the chat`));

            // Send users and room info
            // io.emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
        }
    });

});


// Run And display port connection 
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));