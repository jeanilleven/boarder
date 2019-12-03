var express = require("express");
var app = express();
// var path = require('path'); //not part of lesson

//parsing JSON
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //let server know we need access to public folder 
app.set("view engine", "ejs");//so that we don't have to type .ejs all the time

// var data = ["Ada", "AJ", "Luke", "T-Rex"];

// using mongoose
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/boarder', {useNewUrlParser: true, useFindAndModify: true});


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var roomSchema = new mongoose.Schema({
	roomLabel: String,
	roomCapacity: Number
});

var occupantSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	mname: String,
	email: String,
	password: String,
});

var messageSchema = new mongoose.Schema({
	dateCreated: Date,
	creator: Number, //occID or ownerAccountID
	messageBody: String,
	isDocument: Boolean,
});

var rentalSchema = new mongoose.Schema({
	roomID: String,
	rentNum: Number,
	tenants: [occupantSchema], 
	dateStarted: Date,
	dateEnded: Date,
	messages: [messageSchema]
});


var invoiceSchema = new mongoose.Schema({
	invNum: Number,
	rental: Number, //optional
	amount: Number,
	description: String,
	date: Date,
	items: [{
		description: String,
		price: Number,
		qty: Number
	}]
});

var paymentSchema = new mongoose.Schema({
	payNum: Number,
	invNum: Number,
	amount: Number,
	description: String,
	date: Date,
});

var productSchema = new mongoose.Schema({
	prodID: Number,
	price: Number, //price per quantity
	description: String,
});

var ownerAccountSchema = new mongoose.Schema({
	name: {
		fname: String,
		lname: String,
		mname: String
	},
	email: String,
	houseName: String,
	houseCode: String,
	password: String,
	address: String,
	rooms: [roomSchema],
	rents: [rentalSchema],
	invoices: [invoiceSchema],
	payments: [paymentSchema],
	products: [productSchema],
	invNum: Number,
	payNum: Number,
	rentNum: Number,
	accType: String
});

// Compile model from schema
var ownerAccountModel = mongoose.model('boarderAccounts', ownerAccountSchema);

var one = new ownerAccountModel({email: 'justinrazmont@gmail.com', password: 'wtf'})

app.post('/ownerAccount', (req, res)=>{
	console.log('-----Processing Login');
	console.log(req.body);	
	var em = req.body.email;
	var pass = req.body.pass;
	var id = req.body.id;
	if(id == undefined){
		ownerAccountModel.findOne({email: em, password: pass}, (err, account)=>{
			if(err || account == undefined){
				console.log("Account not found: " + em);
				res.redirect('/login');
			}else{
				console.log("Account found: " + account);
				res.render('ownerAccount', {account: account});
			}
		});
	}else{
		ownerAccountModel.findOne({_id: id}, (err, account)=>{
			if(err || account == undefined){
				console.log("Account not found. ID: " + id);
				res.redirect('/login');
			}else{
				console.log("Account with that ID found: " + account);
				res.render('ownerAccount', {account: account});
			}
		});
	}
});

app.get('/tenantAccount', (req, res) => {
	res.render("tenantAccount");
});

app.get('/', (req, res)=>{
});

app.get('/forgotpw', (req, res)=>{
	// if(req.body.)
	res.render("forgotpw");
});

app.get('/signup', (req, res)=>{
	res.render("signup");
});
app.get('/signup/processNew', (req, res)=>{
	res.render("procesNew");
});

app.get('/changepw', (req, res)=>{
	res.render("changepw");
});

app.get('/login', (req, res)=>{
	res.render('login',  {msg: 'Hi'});
});
app.get('/about', (req, res)=>{
	res.render("about");
});

app.get('/profile', (req, res)=>{
	res.render("profile");
});

app.get('/resetpw', (req, res)=>{
	res.render("resetpw");
});

app.get('/successfulPWreset', (req, res)=>{
	res.render("successfulPWreset");
});

app.get('/updatedpw', (req, res)=>{
	res.render("updatedpw");
});

app.get('*', function(req, res){
	res.send("Page not found. LOL. What.");
});

app.listen(4000, function(){ //listen at port 3000
	console.log("Server is running at PORT 4000.");
});

// --------------------PROCESSES---------------

// --------------------PROCESS ROOMS-----------

app.post('/processNewRoom', (req, res)=>{
	console.log('-----Processing new room');
	console.log(req.body);
	var id = req.body.id;
	var label = req.body.label;
	var capacity =  req.body.capacity;

	ownerAccountModel.findOne({_id: id}, (err, account)=>{
		if(err || id == undefined){
			console.log("Account not found");
			res.redirect(307, 'ownerAccount');
		}else{

			var found = account.rooms.find(function(room){
				return room.roomLabel == label;
			});

			if(found == undefined){
				account.rooms.push({
					roomLabel: label,
					roomCapacity: capacity
				});
				account.rentNum++;
				ownerAccountModel.findOneAndUpdate({_id: id}, {rooms: account.rooms}, (err, account)=>{
					if(err){
						console.log("Trouble updating account with new room");
						res.redirect(307, 'ownerAccount');
					}else{
						console.log("Pushing rooms now...");
						console.log(account.rooms);
						console.log("Successful push: ");
					}
				});
			}else{
				console.log('Room label is not unique');
				res.redirect(307, 'ownerAccount');
			}

		}
	});
});

app.post('/processEditRoom', (req, res)=>{
	console.log("-----Pocessing Edit Room");

	console.log(req.body);
	var id = req.body.id;
	var roomId = req.body.roomId
	var label = req.body.label;
	var capacity =  req.body.capacity;

	ownerAccountModel.findOne({_id: id}, (err, account)=>{
		if(err || id == undefined){
			console.log("Account not found");
			res.redirect(307, 'ownerAccount');
		}else{
			account.rooms.forEach(element => {
				if(element._id == roomId){
					element.roomLabel = label;
					element.roomCapacity = capacity;
				}
			});
			ownerAccountModel.findOneAndUpdate({_id: id}, {rooms: account.rooms}, (err, account)=>{
				if(err){
					console.log("Trouble updating account with new room");
					res.redirect(307, 'ownerAccount');
				}else{
					console.log("Pushing rooms now...");
					console.log(account.rooms);
					console.log("Successful push: ");
					res.redirect(307, 'ownerAccount');
				}
			});
		}
	});
});


app.post('/deleteRoom', (req, res) => {	
	console.log("-----Deleting room");
	console.log(req.body);
	var id = req.body.id;
	var roomId = req.body.roomId;

	ownerAccountModel.findOne({_id: id}, (err, account)=>{
		if(err || id == undefined){
			console.log("Account not found");
			res.redirect(307, 'ownerAccount');
		}else{
			account.rooms = account.rooms.filter(function(value){
				console.log("value._id: " + value._id);
				console.log("roomId: " + roomId);
				console.log("-----------");
				return value._id != roomId;
			});

			ownerAccountModel.findOneAndUpdate({_id: id}, {rooms: account.rooms}, (err, account)=>{
				if(err){
					// console.log("Trouble updating account with new room");
					res.redirect(307, 'ownerAccount');
				}else{
					// console.log("Pushing rooms now...");
					// console.log(account.rooms);
					// console.log("Successful pop: ");
					res.redirect(307, 'ownerAccount');
				}
			});
		}
	});
});

//---------------PROCESS NEW ACCOUNT-----------

app.post('/processNew', (req, res) => {
	console.log('-----Precessing New Account');
	console.log(req.body);
    var fn = req.body.fname;
    var ln = req.body.lname;
    var mi = req.body.mi;
    var hn = req.body.houseName;
    var add = req.body.address;
    var num = req.body.contNum;
    var em = req.body.email;
    var pa1 = req.body.pass1;
    var pa2 = req.body.pass2;
    var opt = req.body.option;	

    ownerAccountModel.create({	
		name: {
			fname: fn,
			lname: ln,
			mi: mi,
		},
		email: em,
		houseName: hn,
		houseCode: hn,
		password: pa1,
		address: add,
		rooms: [],
		rents: [],
		invoices: [],
		payments: [],
		products: [],
		invNum: 0,
		payNum: 0,
		rentNum: 0,
		accType: opt
    }, (err, account) => {
        if(err) {
            res.send("Error in adding in db");
            console.log(err);
        } else {
			console.log("successfully added: " + account);
            res.redirect('/login');
        }
    });
});

//--------PROCESS RENTS-----------------------

app.post('/processAddRent', function(req, res){
	console.log("-----Processing add rent");
	console.log(req.body);
	var id = req.body.id;

	ownerAccountModel.findOne({_id: id}, (err, account)=>{
		if(err || id == undefined){
			console.log("Account not found");
			res.redirect(307, 'ownerAccount');
		}else{
			var newOcc = [];

			req.body.occ.forEach(function(occ){
				occ.password = "-1"; //to indicate unchanged password
				newOcc.push(occ);
			});
			console.log('newOcc:');
			console.log(newOcc);

			account.rents.push({
				roomID: req.body.roomId,
				rentNum: account.rentNum,
				tenants: newOcc, 
				dateStarted: new Date(),
				dateEnded: 0,
				messages: [	]
			});
			account.rentNum++;

			ownerAccountModel.findOneAndUpdate({_id: id}, {rentNum: account.rentNum, rents: account.rents}, (err, account)=>{
				if(err){
					console.log("Trouble updating account with new RENT");
					res.redirect(307, 'ownerAccount');
				}else{
					console.log("Pushing RENT now...");
					console.log(account.rents);
					console.log("Successful push------------------------- ");
					res.redirect(307, 'ownerAccount');
				}
			});
		}
	});
});

