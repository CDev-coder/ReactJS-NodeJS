import React, { useState, useMemo } from "react";

function App2() {
  const [products] = useState([
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
  ]);

  // Separate states for each filter
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [
      "All",
      ...new Set(products.map((p) => p.category)),
    ];
    return uniqueCategories;
  }, [products]);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // 2. Apply stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    // 3. Apply sorting
    if (sortBy === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-a-z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, inStockOnly, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("All");
    setInStockOnly(false);
    setSortBy("default");
  };

  return (
    <div className="product-filter">
      <div className="filters">
        {/* Category filter buttons */}
        <div className="category-filter">
          <h3>Filter by Category:</h3>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "active" : ""}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stock filter */}
        <div className="stock-filter">
          <label>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            Show only in-stock items
          </label>
        </div>

        {/* Sort dropdown */}
        <div className="sort-filter">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort by</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
          </select>
        </div>

        {/* Clear button */}
        <button onClick={clearFilters} className="clear-btn">
          Clear All Filters
        </button>
      </div>

      {/* Product count */}
      <div className="product-count">
        <h3>
          Showing {filteredProducts.length} of {products.length} products
        </h3>
      </div>

      {/* Product list */}
      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p>No products match your filters.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p className={product.inStock ? "in-stock" : "out-of-stock"}>
                {product.inStock ? "In Stock ✓" : "Out of Stock ✗"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App2;
