const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const staticBasePath = "./public/";

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
    useNewUrlParser: true
});

//set images to be stored in /public/images/
const multer = require('multer')
const upload = multer({
    dest: staticBasePath + "images/",
    limits: {
        fileSize: 10000000
    }
});

//creat schema
const itemSchema = new mongoose.Schema({
    title: String,
    path: String,
    description: String,
});

//create collection in the database
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
    const item = new Item({
        title: req.body.title,
        path: req.body.path,
        description: req.body.description,
    });
    try {
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/items', async (req, res) => {
    try {
        let items = await Item.find();
        res.send(items);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//delete API call
const fs = require("fs");
app.delete("/api/items/:id", async (req, res) => {
    try {
        //grab ID
        let id = req.params.id;
        //find item in database
        Item.find({
            "_id": id
        }, (err, docs) => {
            if (err) {
                console.log(err);
                return;
            }
            //delete it
            fs.unlink(staticBasePath + docs[0].path, (err) => {
                if (err)
                    console.log(err);
            });

            //remove from database
            Item.deleteOne({
                "_id": id
            }, (err) => {
                if (err)
                    console.log(err);
            });
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put("/api/items/:id", (req, res) => {
    try {
        let id = req.params.id;
        Item.findOne({
            "_id": id
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            doc.title = req.body.title;
            doc.description = req.body.description;
            doc.save();
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));