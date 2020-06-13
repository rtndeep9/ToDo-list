const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Creating default items documents

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to todo list!"
});

const item2 = new Item({
  name: "Press + button to add new item to your list"
});

const item3 = new Item({
  name: "⬅ hit this to cross off an item"
});

const defaultItems = [item1, item2, item3];


// Home page render

app.get("/", function(req, res) {

  const day = date();

  Item.find(function(error, tutorialItems) {
    if (tutorialItems.length === 0) {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully added default Items");
        }
      });
      res.redirect("/");
    }else{
      res.render("lists", {
        listTitle: day,
        newListItems: tutorialItems
      });
    }
  });
});


app.get("/:customName", function(req, res){
  const customList = req.params.customName;

})



//Adding item to list

app.post("/", function(req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedItem = req.body.checkBox;

  Item.findByIdAndRemove(checkedItem, function(err){
    if(!err){
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
