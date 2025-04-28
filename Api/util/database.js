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

    const timetable =[
        ('Pink Floyd', 'The Dark Side of the Moon', '1973-03-01', 'Progressive Rock'),
  ('Nirvana', 'Nevermind', '1991-09-24', 'Grunge'),
  ('The Beatles', 'Abbey Road', '1969-09-26', 'Rock'),
  ('Radiohead', 'OK Computer', '1997-05-21', 'Alternative Rock'),
  ('Daft Punk', 'Discovery', '2001-03-12', 'Electronic'),
  ('Metallica', 'Master of Puppets', '1986-03-03', 'Thrash Metal'),
  ('Taylor Swift', '1989', '2014-10-27', 'Pop'),
  ('Miles Davis', 'Kind of Blue', '1959-08-17', 'Jazz'),
  ('Beyoncé', 'Lemonade', '2016-04-23', 'R&B'),
  ('Kendrick Lamar', 'DAMN.', '2017-04-14', 'Hip-Hop')

    ];

    for(const t of timetable){
        await dbRun("INSERT INTO timetable (day, time, subject) VALUES (?, ?, ?);",[t.day, t.time, t.subject]);
    } 
}