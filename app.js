require('dotenv/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

app.use(cors());
app.use('*', cors());

const api = process.env.API_URL;

const productsRouter = require('./routers/product');
const categoriesRouter = require('./routers/category');
const ordersRouter = require('./routers/order');
const usersRouter = require('./routers/user');

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
//error handler
app.use(errorHandler)

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

//db connect
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log('Database connection is ready...');
    })
    .catch((error) => {
        console.log(error);
    })

app.listen(3000, () => {
    console.log(`server is running at port ${process.env.PORT}`);
});