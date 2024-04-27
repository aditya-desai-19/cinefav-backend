import express from 'express';
import 'dotenv/config.js';
import bodyParser from 'body-parser';
import connectToDB from './db/index.js';

const app = express();
const port = process.env.PORT || 3000;

//connection to database
connectToDB();

app.use(bodyParser.json());

app.post('/api/signin', (req, res) => {
    console.log('username: ' + req.body.username);
    res.status(201).json({ msg: "Signin successful" });
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})