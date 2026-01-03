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
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`);
      setItems(prevItems => prevItems.filter(i => i.id !== id)); 
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
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

    const categories = {
      breakfast: 1,
      dessert: 2,
      cold: 3,
      hot: 4
    };
    const CategoryID = categories[selectedCategory];

    const formdata = new FormData();
    formdata.append("name", item.name);
    formdata.append("price", item.price);
    formdata.append("CategoryID", CategoryID);
    formdata.append("image", item.image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/items`, formdata);

      const newItem = {
        id: response.data.insertId || Date.now(),
        name: item.name,
        price: item.price,
        CategoryName: selectedCategory,
        image: null 
      };
      setItems(prevItems => [...prevItems, newItem]);

      setItem({ name: "", price: "", image: null });
      document.getElementById("imageInput").value = "";

    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const filteredItems = items.filter(i => 
    i.CategoryName?.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="menu">
      <h2>Our Full Menu</h2>
    
      <div className="menu-categories">
        {["breakfast","dessert","cold","hot"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "active" : ""}
          >
            {cat === "breakfast" ? "Breakfast" :
             cat === "dessert" ? "Dessert" :
             cat === "cold" ? "Cold Drinks" : "Hot Drinks"}
          </button>
        ))}
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
          id="imageInput"
          type="file"
          onChange={handleImageChange}
        />
        <button onClick={handleClick}>Add Item</button>
      </div>

      <div className="menu-items">
        {filteredItems.map((i) => (
          <div key={i.id} className="menu-item">
            {i.image && <img src={`data:image/png;base64,${i.image}`} alt="" />}
            <h3>{i.name}</h3>
            <p>{i.price}$</p>
            <div className="item-actions">
              <button className="remove-btn" onClick={() => handleDelete(i.id)}>
                <DeleteIcon/>
              </button>
              <Link to={`/update/${i.id}`}>
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
