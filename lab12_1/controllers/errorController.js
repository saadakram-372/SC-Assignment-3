const AppError = require("../utils/appError");


const handleDuplicateFieldsDB = (req, res) => {
 	const message ="Duplicated value inserted, please use another value";
	const app = new AppError(message,400);
	app.showerror(req, res);

}

const handleValidationErrorDB = (req,res) => {
	const message = "Invalid input data";
	const app = new AppError(message, 400);
	app.showerror(req, res);
};


const sendErrorprod = (req, res) => {

	const app = new AppError("Encountered unkown error in production mode", 404);
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
		if(error.code === 11000){
			error = handleDuplicateFieldsDB(req, res);
		}
		 if (error.name === "ValidationError"){
			 error = handleValidationErrorDB(req, res);
		 }

		sendErrorprod(error,res);
	}
	else if(process.env.NODE_ENV === "development"){
		sendErrorDev(err,res);
	} else {
		new AppError ("NOPEEEE",404);
	}
}
