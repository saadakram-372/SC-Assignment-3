const AppError = require("../utils/appError");


const handleDuplicateFieldsDB = (req, res,next) => {
 	const message ="Duplicated value inserted, please use another value";
	const app = new AppError(message,400);
	app.showerror(req, res);
	

}

const handleValidationErrorDB = (req,res) => {
	const message = "Invalid Input Data";
	const app = new AppError(message, 400);
	app.showerror(req, res);
};

const handleExpiredTokenError = (req,res) => {
	const message = "Your Token Has Expired";
	const app = new AppError(message, 400);
	app.showerror(req, res);
};

const handleInvalidTokenError = (req,res) => {
	const message = "Invalid Token";
	const app = new AppError(message, 400);
	app.showerror(req, res);
};

const sendErrorprod = (req, res) => {

	const app = new AppError("Encountered unkown error in Production Mode", 404);
	app.showerror(req, res);
	
	}

const sendErrorDev = (err,res) => {
   res.status(err.statusCode).json({ 
   status : err.status,
   error: err,
   message :err.message
   })
};

module.exports = (err,req,res,next) => {

	err.status = err.status || 'error';
	err.statusCode = err.statusCode ||500;

	if (process.env.NODE_ENV === "production") {
		let error = {...err};
		console.log(error);
		if(error.code === 11000){
			error = handleDuplicateFieldsDB(req, res);
		}
		 else if (error.name === "ValidationError"){
			 error = handleValidationErrorDB(req, res);
		 }

		 else if (error.name === "TokenExpiredError"){
		 	error=handleExpiredTokenError(req,res);
		 }

		 else if (error.name === "JsonWebTokenError"){
		 	error- handleInvalidTokenError(req,res);
		 }
       

        else{
		sendErrorprod(error,res,next);
	}
}
	else if(process.env.NODE_ENV === "development"){
		sendErrorDev(err,res);
	} else {
		new AppError ("Unexpected behaviour encountered",404);
	}
}
