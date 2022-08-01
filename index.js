const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dev2077:5uSBIHyIGQnUkv0x@cluster0.0icgxhv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.urlencoded({ express:false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname,'./views'))
app.set('view engine', 'ejs');

app.use(express.json()); 

async function register(client, newListing){
	const result = await client.db("user").collection("users").insertOne(newListing);
	console.log(`insertedId: ${result.insertedId}`);}
	
app.get('/', (req, res) => {
	res.render('index')
});

app.post('/urlshortener', (req, res) => {

	let code_url = Math.random().toString(36).slice(2, 7);
	async function main() 
	{
	try {
		await client.connect();

		try {await register(
			client,
			{
			'code': '/'+code_url,
			'Url' : req.body.data,}
		)}
		catch(err) {
		console.log(err)
		}

	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
	}
	main().catch(console.error);
	
	res.render('urlshortener',{ 
		Url : req.body.data,
		Newurl : 'http://localhost:5000'+'/'+code_url 
	})

  });


app.get('*', (req, res) => {

	console.log(req.params[0])
	async function main() {
	
		try {
			await client.connect();
			let result_user = await client.db("user").collection("users").findOne({ 'code' : req.params[0]});
			if (result_user){
			res.redirect(result_user.Url);}
			else{
				res.render('index')
			}
	
		} catch (e) {
			console.error(e);
		} finally {
			await client.close();
			
		}
	}
	main().catch(console.error);



});


server.listen(5000, () => {
console.log('listening on *:5000');
});



// npx nodemon index.js
// "start": "nodemon./bin/www"
// "start": "nodemon index.js"
// heroku restart
// $ git add .
// $ git commit -am "make it better"
// $ git push heroku master

