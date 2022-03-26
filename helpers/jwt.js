
const jwt = require('express-jwt')

function authJwt() {
    const secret = process.env.SECRET_KEY;
    console.log(secret);
    return jwt({
        secret: secret,
        algorithms: ['HS256']
    }).unless({//exclude paths without user authentication
        path: [
            {
                //regular expression usage
                url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']
            },
            '/api/v1/users/login',
            '/api/v1/users/register',
        ]
    })
}

module.exports = authJwt;