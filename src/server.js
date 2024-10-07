import express from "express";
import client from "./client.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

//Items added
var items = [
  {   id: 3,
    "user_id": "ZM176",
    "keywords": ["hammer", "nails", "tools"],
    "name": "Hammer and nails",
    "description": "A hammer and nails set with three different types of nails",
    "image": null,
    "lat": 47.497,
    "lon": 19.04
  },
  { id: 4,
    "user_id": "AB123",
    "keywords": ["book", "novel", "literature"],
    "name": "Classic Novel",
    "description": "A classic novel in excellent condition",
    "image": null,
    "lat": 51.5074,
    "lon": -0.1278
  },
];

//Function for the main page
function handleMainPage(request, response){
  return response.send("Hello!");
}
app.get("/", handleMainPage);

function createPageHandler(request,response){
  return response.send(client.item(item));
}
app.get("/item/create", createPageHandler);
//Function for the Items page
function handleItemsPage(request, response){
return response.send(client.items(items));
}
app.get("/items", handleItemsPage);

//Function for the item page
function handleItemPage(request, response){
  const id = parseInt(request.params.id);
  const item= items.find((item) => item.id === id);

  if (item === undefined || item === null){
   return response.status(404).send("Item not found!");
  }
  return response.send(client.item(item));
}
app.get("/item/:id", handleItemPage);

//Function to delete an item
function handleItemDelete (request, response){
  const id = parseInt(request.params.id);
  const item= items.findIndex((item) => item.id === id);
  if (item === undefined || item === null){
   return response.status(404).send("Item not found!");
  }
  items.splice(item);
  return response.status(204).send();
}
app.delete("/item/:id", handleItemDelete);

//Function to create a new item
function handleCreate(request, response){
try{
  const item ={
    name:request.body.name,
    user_id: request.body.user_id,
    keywords: request.body.keywords.split(","),
    description: request.body.description,
    image: request.body.image,
    lat: request.body.lat,
    lon: request.body.lon,

  };
  items.push(item);
  response.status(201).send(client.item(item));
}
catch(err){
return response.status(400).send("Bad request!");
}
}
app.post("/item", handleCreate);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
