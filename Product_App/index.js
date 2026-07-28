const express = require('express')
const app = express();
const methodOverride = require("method-override");

app.set("view engine" ,"ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const products = require("./data/products");

app.get("/", (req,res)=>{
    res.render("home");
})

app.get("/products", (req,res)=>{
    res.render("products" , {products});
})

app.get("/products/new", (req, res) => {
    res.render("new");
});

app.post("/products", (req, res) => {

    const { name, price, image } = req.body;

    const product = {
        id: products.length + 1,
        name,
        price,
        image
    };

    products.push(product);

    res.redirect("/products");
});

app.get("/products/:id", (req, res) => {

    const { id } = req.params;

    const product = products.find(item => item.id == id);

    res.render("show", { product });

});

app.get("/products/:id/edit", (req, res) => {

    const { id } = req.params;

    const product = products.find(item => item.id == id);

    res.render("edit", { product });

});

// app.post("/products/:id/edit",(req,res)=>{
//     const {id} = req.params;
//     const product = products.find((item)=> item.id == id) 
//     product.name = req.body.name;
//     product.price = Number(req.body.price);
//     product.image = req.body.image;
//     product.desc = req.body.desc;

//     res.redirect("/products");

// })

app.put("/products/:id", (req, res) => {

    const { id } = req.params;

    const product = products.find(item => item.id == id);

    const { name, image, price, desc } = req.body;

    product.name = name;
    product.price = price;
    product.image = image;
    product.desc = desc;

    res.redirect("/products");

});

app.post("/products/:id/delete", (req,res)=>{
    const { id } = req.params;

    const index = products.findIndex(item => item.id == id);

    products.splice(index,1);

    res.redirect("/products");
})

app.listen(3000, () => {
    console.log("Server running");
});