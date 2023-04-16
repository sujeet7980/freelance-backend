const express = require('express');
const rateLimit  = require('express-rate-limit');
const helmet = require('helmet');
var cors = require('cors')
const app = express();
app.use(cors());
const morgan = require('morgan');
const ProjectRouter = require('./routes/ProjectRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter= require('./routes/reviewRoutes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morganSanitize= require('express-mongo-sanitize');
const xss= require('xss-clean');
const hpp= require('hpp');
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// data sanitize against NOSQL query injection
app.use(morganSanitize());

// data sanitize against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
  whitelist:['duration','price']
}));
// body parser , reading data from the body to req.body
app.use(express.json({limit:"10kb"}));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  (req.resquestTime = new Date()).toISOString();
  ///console.log(req.headers)
  next();
});
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message : "Too many req from this id!! Try after 1 hour"
}
)
app.use('/api',limiter);
app.use('/api/v1/projects', ProjectRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
