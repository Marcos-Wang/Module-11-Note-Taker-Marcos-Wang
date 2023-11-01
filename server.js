const express = require('express');
const path = require('path');
const fs = require('fs');
//universally unique id
const { uuidv4 } = require('uuidv4');



const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//path to file not working for some reason?
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//read and return saved notes from the json file, still as a json file
app.get('/api/notes', (req, res) => {
    //reads saved DB notes and checks for errors
    res.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {

            const notes = JSON.parse(data);
            return res.json(savedNotes);


        }
    })


});

// post new notes with an unique ID 
app.post('/api/notes', async (req, res) => {

    try {
        const { title, text } = req.body;

        if (title && text) {

            const newNote = {

                title,
                text,
                id: uuid()
            }


            const addedText = await fs.readFileSync("./db/db.json", "utf-8");

            const postData = JSON.parse(addedText);

            postData.push(newNote);

            //string format of Note

            const postString = JSON.stringify(postData, null, 2);

            await fs.writeFileSync("./db/db.json", postString);

            console.info("Note successfully posted.");

            const result = {
                status: "success",
                body: newNote
            }


            return res.status(201).json(response);

        } else {
            return res.status(500).json("Note not posted due to an error.")
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }


});

//Bonus

// //delete notes
// app.delete("/api/notes/:id", async (req, res) =>{


    
//     try{

//         const database = await fs.readFileSync('./db/db.json', "utf-8");
//         const noteArray = JSON.parse(database);
//         const noteToDeleteID = req.params.id;

//         noteToDelete = removeId(noteArray, noteToDeleteID);
        
//         const writeRemove = JSON.stringify(removal, null, 2);
//         await fs.writeFileSync('./db/db.json', writeRemove);
//         return res.status(201).json("Note successfully removed.")



//     }

//     catch (err) {
//         return res.status(500).json(err)
//     }


// });




// //separated this function from the delete for simplicity
// function removeId(array, id){
//     return array.reduce((position, value)=>{
//         console.log(value);
//         if (value.id !==  id){
//             position.push(value);
//         }
//         console.log(position);
//         return position;
//     }, [])
// }

app.listen(PORT, () => console.log(`App listening at  http://localhost:${PORT}`));


