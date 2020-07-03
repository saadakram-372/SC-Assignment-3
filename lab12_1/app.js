const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const AppError = require("./utils/appError.js");
const menuRoute = require("./routes/menuRoutes");
const userRoute = require("./routes/userRoutes");
const errorController = require("./controllers/errorController")
const app = express();
const dotenv = require('dotenv');
dotenv.config();
if (process.env.NOD_ENV === "development"){
	app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use((req,res,next)=>{
	console.log('Hello from the middleware......');
	next();
});
app.use("/api/khaapa/menus",menuRoute);
app.use("/api/khaapa/user", userRoute);


app.all("*", (req, res) => {
	console.log("HERE");
	const app = new AppError(`Can not find ${req.originalUrl} on this server`,404);
	app.showerror(req, res);
	// res.status(404).json({
	// 	status: "error",
	// 	message: `Cant find ${req.originalUrl} here`
	// });
});

app.use(errorController);


// app.use("/api/khaapa/users",userRoute);



module.exports = app;

