import 'dotenv/config.js';
import { app } from '../app.js';
import connectToDB from './db/index.js';

const port = process.env.PORT || 3000;

//connection to database
connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on ${port}`)
        });
    })
    .catch((err) => {
        console.log("MONGODB connection failed", err);
    });
