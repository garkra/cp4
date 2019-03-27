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
mongoose.connect('mongodb://localhost:27017/mealList', {
    useNewUrlParser: true
});

//create schema
const mealSchema = new mongoose.Schema({
    title: String,
    cost: Number,
});

//create collection in the database
const Meal = mongoose.model('Meal', mealSchema);


// Create a new meal: takes a title and a cost.
app.post('/api/meals', async (req, res) => {
    const meal = new Meal({
        title: req.body.title,
        cost: req.body.cost,
    });
    try {
        await meal.save();
        res.send(meal);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//Get the meals from the database
app.get('/api/meals', async (req, res) => {
    try {
        let meals = await Meal.find();
        res.send(meals);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//delete API call
app.delete("/api/meals/:id", async (req, res) => {
    try {
        //grab ID
        let id = req.params.id;
        //find meal in database
        Meal.find({
            "_id": id
        }, (err, docs) => {
            if (err) {
                console.log(err);
                return;
            }

            //remove from database
            Meal.deleteOne({
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

app.put("/api/meals/:id", (req, res) => {
    try {
        let id = req.params.id;
        Meal.findOne({
            "_id": id
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            doc.title = req.body.title;
            doc.cost = req.body.cost;
            doc.save();
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));