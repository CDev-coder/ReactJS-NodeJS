import React, { useState, useEffect } from "react";

function filterProducts(products, selectedValue) {
  let filteredProducts = [...products];

  if (selectedValue === "option1") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedValue === "option2") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedValue === "option3") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedValue === "option4") {
    filteredProducts = filteredProducts.filter(
      (product) => product.inStock == true,
    );
  } else if (selectedValue === "option5") {
    filteredProducts.sort((a, b) => b.category.localeCompare(a.category));
  } else if (selectedValue === "") {
    filteredProducts = [];
  }
  return filteredProducts;
}

function App() {
  const [selectedValue, setSelectedValue] = useState("");
  //const [itemCount, setItemCount] = useState(0);

  const products = [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 999,
      inStock: true,
    },
    { id: 2, name: "T-Shirt", category: "Clothing", price: 25, inStock: true },
    {
      id: 3,
      name: "Coffee Maker",
      category: "Home",
      price: 75,
      inStock: false,
    },
    {
      id: 4,
      name: "Headphones",
      category: "Electronics",
      price: 199,
      inStock: true,
    },
    { id: 5, name: "Jeans", category: "Clothing", price: 60, inStock: true },
    { id: 6, name: "Blender", category: "Home", price: 45, inStock: false },
    {
      id: 7,
      name: "Smartphone",
      category: "Electronics",
      price: 699,
      inStock: true,
    },
    { id: 8, name: "Jacket", category: "Clothing", price: 120, inStock: false },
  ];

  // Your filtering logic here
  function dropDownChange(event) {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  }
  function clearFilter() {
    setSelectedValue("");
  }
  function checkInStock() {
    setSelectedValue("option4");
  }
  function checkByCategory() {
    setSelectedValue("option5");
  }

  return (
    <div className="product-filter">
      {/* Controls */}
      <div className="filters">
        {/* Category buttons */}
        <button onClick={checkByCategory}>Category</button>
        {/* Stock filter */}
        <button onClick={checkInStock}>In Stock</button>
        {/* Sort dropdown */}
        <select value={selectedValue} onChange={dropDownChange}>
          <option value="">--Select an option--</option>
          <option value="option1">Price: Low to High</option>
          <option value="option2">Price: High to Low</option>
          <option value="option3">Name: A to Z</option>
        </select>
        {/* Clear button */}
        <button onClick={clearFilter}>Clear</button>
      </div>

      {/* Product count */}
      <div className="product-count">
        <h2>
          Products Found: {filterProducts(products, selectedValue).length}
        </h2>
      </div>
      {/* Product list */}
      <div className="product-list">
        {
          /* Map through filtered products */
          filterProducts(products, selectedValue).map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>In Stock: {product.inStock ? "Yes" : "No"}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
