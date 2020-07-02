
class AppError extends Error {

    constructor(message, statusCode) {
        super();
        console.log(message, statusCode)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);

    }

    showerror = (req, res)=>{
        res.status(this.statusCode).json({
            status: this.status,
            message: this.message
        });
    }
   
}

module.exports =  AppError;