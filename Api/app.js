import express from 'express';
import cors from 'cors';
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js';

const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/album', async (req, res)=>{
    const albums = await dbAll("SELECT * FROM timetable");
    res.status(200).json(albums);
});


app.use((req, res, next, err) =>{
    if(err){
        res.status(500).json({message: `Error ${err.message}`});
    }
});

async function startServer() {
    await initializeDatabase();
    app.listen(3001, () =>{
        console.log('server runs on 3001') ;
    });
}

startServer();