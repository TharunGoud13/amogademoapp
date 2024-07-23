const http = require('http') // used to create server
const { Server } = require('socket.io')  // used for bidirectional communication b/w server and client
const cors = require('cors') // security feature implemented by browser to prevent webpages from making requests to other domains

const httpServer = http.createServer()

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'], 
    credentials: true,
  },
})

// listens for incoming connections on the specified port
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`user with id-${socket.id} joined room - ${roomId}`)
  })

  socket.on('send_msg', (data) => {
    console.log(data, 'DATA')
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit('receive_msg', data)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`)
})
