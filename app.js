require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');



const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticatingUser = require('./middleware/authentication');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, //15 mins
  max:100 //limit each ip to 100 request per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());


// routes

//dummy route for testing
app.get('/',(req,res)=>{
  res.send('jobs api')
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticatingUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>

      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
