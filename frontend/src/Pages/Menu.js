import React, { useState, useEffect } from "react"; 
import EditIcon from "@mui/icons-material/Edit";  
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link } from "react-router-dom";

function Menu() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("breakfast");
  const [item, setItem] = useState({
    name: "",
    price: "",
    image: null
  });

  const [, setError] = useState(false);


  const handleDelete = async (id) => {
    console.log(id);
    try {
    await axios.delete(`http://localhost:5000/items/${id}`
    );
    window.location.reload()
    } catch (err) {
    console.log(err); } 
  };

  const fetchAllItems = async () => {
  try {
    const res = await axios.get("http://localhost:5000/items");
    setItems(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchAllItems();
}, []);

  const handleChange = (e) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setItem((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    
    if (!item.name || !item.price || !item.image) {
      alert("Please fill in all fields!");
      return;
    }

    let CategoryID;
    
    if (selectedCategory === "breakfast") {
      CategoryID = 1;
    } else if (selectedCategory === "dessert") {
      CategoryID = 2;
    } else if (selectedCategory === "cold") {
      CategoryID = 3;
    } else if (selectedCategory === "hot") {
      CategoryID = 4;
    }

    const formdata = new FormData();
    formdata.append('name', item.name);
    formdata.append('price', item.price);
    formdata.append('CategoryID', CategoryID);
    formdata.append('image', item.image);

    try {
      await axios.post("http://localhost:5000/items", formdata);
      
      // Clear form
      setItem({
        name: "",
        price: "",
        image: null
      });
      document.getElementById('imageInput').value = "";
      
      // Refresh items
      fetchAllItems();
      
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };



    const filteredItems = items.filter(item => item.CategoryName === selectedCategory);

  return (
    <div className="menu">
      <h2>Our Full Menu</h2>
    
      <div className="menu-categories">
        <button
          onClick={() => setSelectedCategory("breakfast")}
          className={selectedCategory === "breakfast" ? "active" : ""}
        >
          Breakfast
        </button>

        <button
          onClick={() => setSelectedCategory("dessert")}
          className={selectedCategory === "dessert" ? "active" : ""}
        >
          Dessert
        </button>

        <button
          onClick={() => setSelectedCategory("cold")}
          className={selectedCategory === "cold" ? "active" : ""}
        >
          Cold Drinks
        </button>
        
        <button
          onClick={() => setSelectedCategory("hot")}
          className={selectedCategory === "hot" ? "active" : ""}
        >
          Hot Drinks
        </button>
      </div>

      <div className="add-form">
        <h3>Add New Item to {selectedCategory}</h3>
        <input
          type="text"
          placeholder="Dish name"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Price"
          name="price"
          value={item.price}
          onChange={handleChange}
        />
        <input
          type="file"
          placeholder="Image URL"
          onChange={handleImageChange}
        />
        <button onClick={handleClick}>Add Item</button>
      </div>

      <div className="menu-items">
        {filteredItems.map((item) => (
        <div key={item.id} className="menu-item">
          <img src={`data:image/png;base64,${item.image}`} alt="" />
          <h3>{item.name}</h3>
          <p>{item.price}$</p>
          <div className="item-actions">
            <button
              className="remove-btn"
              onClick={() => handleDelete(item.id, item.name)}>
              <DeleteIcon/>
            </button>
            <Link to={`/update/${item.id}`}>
              <button className="update-btn">
                <EditIcon/>
              </button>
            </Link>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
