const mongoose = require("mongoose");

const  menuSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true,"Menu must have a name"],
		unique:true
	},
	category:{
		type:String,
	},
	description:{
		type:String
	},
	price:{
		type:Number,
		required: [true,"Must have a price"]
	},
	priceDiscount:{
		type:Number,
		required: [true]
	},
	image:{
		type:String
	},
	rating:{
		type:Number,
		default:4.0
	},
	startDates:[Date]
});

const Menu = mongoose.model('Menu',menuSchema);

module.exports = Menu;