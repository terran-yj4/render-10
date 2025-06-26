const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))

app.ws('/ws', (ws, req) => {
  connects.push(ws)

  ws.on('message', (data) => {
    try {
      const { username, message } = JSON.parse(data)
      console.log(`Received from ${username}: ${message}`)

      const sendData = JSON.stringify({ username, message })
      connects.forEach((socket) => {
        if (socket.readyState === 1) {
          socket.send(sendData)
        }
      })
    } catch (e) {
      console.error('Invalid message format', e)
    }
  })

  ws.on('close', () => {
    connects = connects.filter((conn) => conn !== ws)
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
