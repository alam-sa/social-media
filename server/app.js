const express = require('express');
const PORT = 8800;
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes/index');
dotenv.config();

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('Mongo connected');
});

// middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(router)

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
})