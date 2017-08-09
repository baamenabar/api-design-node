// TODO: make this work.
// if yuo go to localhost:3000 the app
// there is expected crud to be working here
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');

// express.static will serve everything
// with in client as a static resource
// also, it will server the index.html on the
// root of that directory on a GET to '/'
app.use(express.static('client'));

// body parser makes it possible to post JSON to the server
// we can accss data we post on as req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var lions = [
  {
    "age": "3",
    "gender": "male",
    "name": "Mufasa",
    "pride": "La cigueña",
    "uuid": "2b95d5f0-0050-4090-bf06-01cffd59b374",
    "id": 1
  },
  {
    "age": "1",
    "gender": "female",
    "name": "Nala",
    "pride": "La cigueña",
    "uuid": "6dd3827c-bc6a-4ad8-b875-66357321fe8f",
    "id": 2
  },
  {
    "age": "3",
    "gender": "male",
    "name": "Skar",
    "pride": "La carroña",
    "uuid": "c26b2d0b-5751-4bda-891b-2e24b15533e4",
    "id": 3
  }
];
var id = 3;

// TODO: make the REST routes to perform CRUD on lions

app.get('/lions', (req,res) => {
	res.json(lions)
})

app.get('/lions/:id', (req,res) => {
	const requestedLion = lions.find(item => item.uuid == req.params.id)
	if (!requestedLion) {
		res.status(404).send({message:'Lion not found'})
		return;
	}
	res.json(requestedLion)
})

app.post('/lions', (req,res) => {
	console.log(req.body)
	req.body.uuid = generateUUID()
	req.body.id = ++id;
	lions.push(req.body)
	res.status(201).json(req.body)
})

app.put('/lions/:id', (req,res) => {
	console.log(req.body)
	const requestedLion = lions.find(item => item.uuid == req.params.id)
	if (!requestedLion) {
		res.status(404).send({message:'Lion not found'})
		return;
	}
	const updateData = req.body;
	if (updateData.id)delete updateData.id;
	if (updateData.uuid)delete updateData.uuid;
	res.json(Object.assign(requestedLion, req.body))
})

app.delete('/lions/:id', (req,res) => {
	console.log(req.body)
	const requestedLionIndex = lions.findIndex((item, index) => {
		return item.uuid == req.params.id
	})
	if (requestedLionIndex < 0) {
		res.status(404).send({message:'Lion not found'})
		return;
	}
	res.json(lions.splice(requestedLionIndex, 1))
})

app.listen(3000);
console.log('on port 3000');


const requirements = {
  "GET /lions": {
    "desc": "returns all lions",
    "response": "200 application/json",
    "data": [{}, {}, {}]
  },

  "GET /lions/:id": {
    "desc": "returns one lion respresented by its id",
    "response": "200 application/json",
    "data": {}
  },

  "POST /lions": {
    "desc": "create and returns a new lion uisng the posted object as the lion",
    "response": "201 application/json",
    "data": {}
  },

  "PUT /lions/:id": {
    "desc": "updates and returns the matching lion with the posted update object",
    "response": "200 application/json",
    "data": {}
  },

  "DELETE /lions/:id": {
    "desc": "deletes and returns the matching lion",
    "response": "200 application/json",
    "data": {}
  }
};

function generateUUID () { // Public Domain/MIT
    let d = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}