function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt auth error
        return res.status(401).json(
            {
                message: "The user is not authorized"
            }
        )
    }
    if (err.name === 'ValidationError') {
        // validation error example fileuploads
        return res.status(401).json(
            {
                message: err
            }
        )
    }
    //default server error
    return res.status(500).json(err);
}

module.exports = errorHandler;