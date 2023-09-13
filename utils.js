
// Esta classe é responsável por criar um erro personalizado, que será usado em toda a aplicação.
class AppError extends Error{
    constructor(message,statusCode){
    super(message)

    this.statusCode=statusCode
    this.status= `${statusCode}`.startsWith('4') ? 'fail' : 'err';
    this.isOperational= true


    Error.captureStackTrace(this,this.constructor)



    }

}


module.exports = AppError;