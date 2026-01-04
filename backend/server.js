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
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
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

const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'lamakang2000@gmail.com',
    pass: 'akmiqzdgyvnpweap'
  }
});


// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Email to the customer (thank you email)
    const customerMailOptions = {
      from: '"Moonlight Coffee Shop" <lamakang2000@gmail.com>',
      to: email,
      subject: 'Thank You for Contacting Us - Coffee Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef9f4;">
          <div style="background-color: #3e2c1c; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fdf6ee; margin: 0;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #3e2c1c;">Dear ${name},</p>
            
            <p style="font-size: 16px; color: #3e2c1c; line-height: 1.6;">
              Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background-color: #f0ebe3; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3e2c1c; margin-top: 0;">Your Message:</h3>
              <p style="color: #5f4d3a; font-style: italic;">"${message}"</p>
            </div>
            
            <p style="font-size: 16px; color: #3e2c1c; line-height: 1.6;">
              In the meantime, feel free to visit us at:<br>
              <strong>123 Corniche Street, Beirut, Lebanon</strong>
            </p>
            
            <p style="font-size: 16px; color: #3e2c1c; line-height: 1.6;">
              <strong>Opening Hours:</strong><br>
              Mon–Fri: 8am – 6pm<br>
              Sat–Sun: 9am – 4pm
            </p>
            
            <hr style="border: none; border-top: 2px solid #d4c1ae; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #7a5e42; text-align: center;">
              Best regards,<br>
              <strong style="color: #3e2c1c;">The Coffee Shop Team</strong>
            </p>
          </div>
        </div>
      `
    };

    // Email to admins (both you and your friend)
    const adminMailOptions = {
      from: '"Moonlight Coffee Shop" <lamakang2000@gmail.com>',
      to: 'lamakang2000@gmail.com, likaaalyassine@gmail.com',  
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #3e2c1c;">New Contact Form Submission</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3e2c1c;">${message}</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
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