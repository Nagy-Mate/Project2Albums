import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite');
export function dbAll(sql, params = []){
    return new Promise((resolve, reject)=>{
        db.all(sql, params, (err, rows)=>{
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []){
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) =>{
            if(err) reject(err);
            else resolve(row);
        });
    });
} 

export function dbRun(sql, params = []){
    return new Promise((resolve, reject) =>{
        db.run(sql, params, function(err){
            if(err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase(){
    await dbRun("DROP TABLE IF EXISTS albums");
    await dbRun("CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY AUTOINCREMENT, band STRING, title STRING, releaseDate DATE, genre STRING)");

    const albums =[
        {band: 'Pink Floyd', title:  'The Dark Side of the Moon',releaseDate:  '1973-03-01',genre: 'Progressive Rock'},
        {band: 'Nirvana',title:  'Nevermind',releaseDate:  '1991-09-24',genre:  'Grunge'},
        {band: 'The Beatles',title:  'Abbey Road',releaseDate:  '1969-09-26',genre:  'Rock'},
        {band: 'Radiohead',title:  'OK Computer',releaseDate:  '1997-05-21',genre:  'Alternative Rock'},
        {band: 'Daft Punk',title:  'Discovery',releaseDate:  '2001-03-12',genre:  'Electronic'},
        {band: 'Metallica',title:  'Master of Puppets',releaseDate:  '1986-03-03',genre:  'Thrash Metal'},
        {band: 'Taylor Swift',title:  '1989',releaseDate:  '2014-10-27',genre:  'Pop'},
        {band: 'Miles Davis',title:  'Kind of Blue',releaseDate:  '1959-08-17',genre:  'Jazz'},
        {band: 'Beyoncé',title:  'Lemonade',releaseDate:  '2016-04-23',genre:  'R&B'},
        {band: 'Kendrick Lamar',title:  'DAMN.',releaseDate:  '2017-04-14',genre:  'Hip-Hop'}

    ];

    for(const album of albums){
        await dbRun("INSERT INTO albums (band, title, releaseDate, genre) VALUES (?, ?, ?, ?);",[album.band, album.title, album.releaseDate,album.genre]);
    } 
}