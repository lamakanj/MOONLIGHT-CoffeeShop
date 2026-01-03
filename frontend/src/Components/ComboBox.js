import React, { useState, useEffect } from 'react';

function ComboBox({ onValueChange, selectedValue }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

       fetch(`${process.env.REACT_APP_API_URL}/categories`)

        .then(response => response.json())

        .then(data =>

        { setCategories(data); })

        .catch(error => {

        console.error('Error fetching data:', error);

    });

    }, []);

    const handleChange = (event) => {

    onValueChange(event.target.value);};

    return(

        <select onChange={handleChange} value={selectedValue}>

        <option value="">Select a Category</option>

        {categories.map(category => (<option
        key={category.CategoryID}
        value={category.CategoryID}>{category.CategoryName}

        </option>
        ))}
        </select>
    ); 
}

export default ComboBox;