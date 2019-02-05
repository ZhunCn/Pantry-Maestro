var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var chalk = require('chalk');
var config = require('./config');

require('dotenv').config();

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Backend API routes
app.use(require('./src/backend/routes')());


// Serve dashboard main.js
app.get('/public/main.js', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist/main.js'));
});
// Intercept requests and redirect to homepage
app.get('/public/index.html', (req, res) => {
	res.redirect('/');
});
app.get('/index.html', (req, res) => {
	res.redirect('/');
});


// Frontend endpoints
app.use('/public', express.static(__dirname + "/dist"));

// Catch all for frontend routes
app.all('/*', function(req, res) {
	res.sendFile(path.join(__dirname, '/dist', '/index.html'));
});

const PORT = process.env.PORT || config.dev.port;
app.listen(PORT);

console.log(chalk.green("Started on port " + PORT));

const DATABASE = process.env.MONGODB_URI || config.dev.database;

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE, { useNewUrlParser: true })
	.then(res => {
		console.log(chalk.green('Connected to MongoDB: ' + DATABASE));
	}).catch(err => {
		console.log(chalk.red('Error connecting to MongoDB: ' + err));
	}
);
