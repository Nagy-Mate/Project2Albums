import express from 'express';
import cors from 'cors';
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js';

const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/album', async (req, res)=>{
    const albums = await dbAll("SELECT * FROM albums");
    res.status(200).json(albums);
});

app.get('/album/:id', async (req,res) => {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);
    if(!album){
        return res.status(404).json({message: "Not found"});
    }
    res.status(200).json(album);
    
})

app.post('/album', async (req, res) =>{
    const {band, title, releaseDate, genre} = req.body;
    if(!band || !title || !releaseDate || !genre ){
        return res.status(400).json({message: "Missing data"});
    }
    const result = await dbRun("INSERT INTO albums (band, title, releaseDate, genre) VALUES (?, ?, ?, ?);",[band, title, releaseDate, genre]);
    res.status(201).json({id: result.lastID, band, title, releaseDate, genre});
});

app.put("/album/:id", async (req, res) =>{
    const id = req.params.id;
    const data = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);

    if(!data){
        return res.status(404).json({message: "Not found"});
    }

    const {band, title, releaseDate, genre} = req.body;

    if(!band || !title || !releaseDate || !genre ){
        return res.status(400).json({message: "Missing data"});
    }

     try {
        await dbRun("UPDATE albums SET band = ?, title = ?, releaseDate = ?, genre = ? WHERE id = ?;", [band, title, releaseDate, genre, id]);
        return res.status(200).json({ id, band, title, releaseDate, genre });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating album" });
    }
});

app.delete("/album/:id", async (req, res)=>{
    const id = req.params.id;
    const data = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);

    if(!data){
        return res.status(404).json({message: "Not found"});
    }
        
    await dbRun("DELETE FROM albums WHERE id = ?;", [id]);
    res.status(200).json({message: "Successfuly deleted! "});

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