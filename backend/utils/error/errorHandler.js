const errorHandler = (status, message) => {
    const error = new Error();
    error.message = message;
    error.statusCode = status;
    return error;
}

export default errorHandler;