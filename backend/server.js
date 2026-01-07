require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require("path");
const multer = require("multer");
const fs = require('fs');


const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Multer Configuration
const storage = multer.diskStorage({ // set the
  destination: (req, res ,cb) => {
  cb(null, 'uploads/')
  },
  filename:(req, file, cb)=>{
  cb(null,file.originalname + "_" + Date.now() +
  path.extname(file.originalname))
}})

const upload = multer({storage:storage })

app.delete("/items/:id", (req, res) => {

  const id = req.params.id;

  console.log (id);

  const q = " DELETE FROM items WHERE id = ? ";

  db.query(q, [id], (err, data) => {

    if (err) return res.send(err);

    return res.json(data);
  });

});

app.post("/items", upload.single('image'), (req, res) => {
  
  const name = req.body.name;
  const price = req.body.price;
  const categoryID = req.body.CategoryID;
  const image = req.file.filename;
  const q = "INSERT INTO items( name, price,categoryID, image) VALUES (?,?,?,?)";

  db.query(q, [name,price,categoryID,image], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

// Get all items
app.get("/items", (req, res) => {
  const q = `SELECT items.id, items.name, items.price, items.image, categories.CategoryName FROM items INNER JOIN categories ON items.CategoryID = categories.CategoryID ORDER BY items.id`;
  db.query(q, (err, data) => {
    if (err) {
      console.log("Query error:", err);
      return res.status(500).json(err);
    }
    for (const d of data)
    {
      d.image = fs.readFileSync(`./uploads/${d.image}`).toString('base64');
    }
    console.log("Sending", data.length, "items");
    return res.json(data);
  });
});
app.use(express.static('public'));


app.get("/categories", (req, res) => {
  const q = "SELECT * FROM categories";
  
  db.query(q, (err, data) => {
    if (err) {
      console.log("Query error:", err);
      return res.status(500).json(err);
    }
    console.log("Sending categories:", data);
    return res.json(data);
  });
});

app.get('/search/:id', (req, res) => {

  const id = req.params.id;

  const q = "SELECT * FROM items WHERE id = ?";

  db.query(q,[id] ,(err, data) => {

    if (err) {

    return res.json(err);

    }

    return res.json(data);
  });

});

app.post("/modify/:id", upload.single('image'), (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const categoryID = req.body.categoryID;
  const image = req.file ? req.file.filename : null;
  
  let q;
  let values;
  
  if (image) {
    q = "UPDATE items SET `name` = ?, `price` = ?, `CategoryID` = ?, `image` = ? WHERE id = ?";
    values = [name, price, categoryID, image, id];
  } else {
    q = "UPDATE items SET `name` = ?, `price` = ?, `CategoryID` = ? WHERE id = ?";
    values = [name, price, categoryID, id];
  }
  
  db.query(q, values, (err, data) => {
    if (err) {
      return res.send(err);
    }
    return res.json(data);
  });
});




//sign up 
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const query = "INSERT INTO admin (email, password) VALUES (?, ?)";
  db.query(query, [email, password], (err) => {
    if (err) return res.json("Error");

    res.json("Admin registered successfully");
  });
});
//Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT * FROM admin WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) return res.json("Error");

    if (result.length > 0) {
      res.json("Login success");
    } else {
      res.json("Invalid credentials");
    }
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});