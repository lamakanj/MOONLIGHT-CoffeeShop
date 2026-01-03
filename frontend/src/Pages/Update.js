import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ComboBox from '../Components/ComboBox';

function Update() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [, setCategoryID] = useState('');
  const [image, setImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

 useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_URL}/search/${id}`)
    .then(res => {
      setName(res.data[0].name);
      setPrice(res.data[0].price);
      setCategoryID(res.data[0].CategoryID);
      setSelectedValue(res.data[0].CategoryID);
      setImage(res.data[0].image);
    })
      .catch(err => console.log(err));
  }, [id]);

  const handleFile = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleDropdownChange = (value) => {
    setSelectedValue(value);
    setCategoryID(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('price', price);
    formdata.append('categoryID', selectedValue);
    if (newImage) {
      formdata.append('image', newImage);
    }

    try {
    await axios.post(`${process.env.REACT_APP_API_URL}/modify/${id}`, formdata);
    navigate("/menu");
  }catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="update-page">
      <div className="update-container">
        <h1>Update Item</h1>
        
        <form className="update-form" onSubmit={handleClick}>
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter item name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="text"
              placeholder="Enter price"
              name="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <ComboBox
              onValueChange={handleDropdownChange}
              selectedValue={selectedValue}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Item Image</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleFile}
            />
            {image && !newImage && (
              <p className="current-image-info">Current: {image}</p>
            )}
          </div>
          
          <div className="button-group">
            <button type="submit">Update Item</button>
            
            {error && <p className="error-message">Something went wrong! Please try again.</p>}
            
            <Link to="/menu">See all Items</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Update;