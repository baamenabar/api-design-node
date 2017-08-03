// TODO: create a basic server with express
// that will send back the index.html file on a GET request to '/'
// it should then send back jsonData on a GET to /data

const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

var jsonData = {count: 12, message: 'hey'}

app.set('port', 3000)

const server = app.listen(app.get('port'), () => {
	currentPort = server.address().port
	console.log('Simple server listening in port ', currentPort)
})

app.get('/', (req, res) => {
	/*fs.readFile('index.html', (err, rawContent) => {
		
		if (err) {
			res.status(404).send(err);
		}
		
		res.send(rawContent.toString().replace(' title', ' buffered title'))
	})
	*/
	res.sendFile(path.join(__dirname, 'index.html'), err => {
		res.status(500).send(err)
	})
})

app.get('/data', (req, res) => {
	res.send(jsonData)
})
