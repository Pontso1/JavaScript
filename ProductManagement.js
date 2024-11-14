// src/components/ProductManagement.js
import React, { useState, useEffect } from 'react';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', desc: '', category: '', price: '', quantity: '' });
    const [editIndex, setEditIndex] = useState(-1);

    // Fetch all products from backend
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProduct({ ...product, [id]: value });
    };

    // Add or Update product
    const addOrUpdateProduct = (e) => {
        e.preventDefault();
        const method = editIndex === -1 ? 'POST' : 'PUT';
        const url = editIndex === -1 ? 'http://localhost:5000/products' : `http://localhost:5000/products/${products[editIndex].id}`;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        })
            .then(response => response.json())
            .then(newProduct => {
                const updatedProducts = [...products];
                if (editIndex === -1) {
                    updatedProducts.push(newProduct);
                } else {
                    updatedProducts[editIndex] = newProduct;
                    setEditIndex(-1);
                }
                setProducts(updatedProducts);
                setProduct({ name: '', desc: '', category: '', price: '', quantity: '' });
            })
            .catch(error => console.error('Error adding/updating product:', error));
    };

    // Sell product (reduce quantity by 1)
    const sellProduct = (index) => {
        const productId = products[index].id;
        fetch(`http://localhost:5000/products/sell/${productId}`, { method: 'PUT' })
            .then(response => response.json())
            .then(updatedProduct => {
                const updatedProducts = [...products];
                updatedProducts[index] = updatedProduct;
                setProducts(updatedProducts);
            })
            .catch(error => console.error('Error selling product:', error));
    };

    // Edit a product (populate form)
    const editProduct = (index) => {
        setEditIndex(index);
        setProduct({ ...products[index] });
    };

    // Delete a product
    const deleteProduct = (index) => {
        const productId = products[index].id;
        fetch(`http://localhost:5000/products/${productId}`, { method: 'DELETE' })
            .then(() => {
                const updatedProducts = products.filter((_, i) => i !== index);
                setProducts(updatedProducts);
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    return (
        <div id="product-management">
            <h2>Product Management</h2>
            <form onSubmit={addOrUpdateProduct}>
                <input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    id="desc"
                    placeholder="Description"
                    value={product.desc}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    id="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    id="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    id="quantity"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">{editIndex === -1 ? 'Add Product' : 'Update Product'}</button>
            </form>

            <h3>Product List</h3>
            <ul>
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <li key={index}>
                            <span>{product.name} - {product.quantity} in stock - ${product.price}</span>
                            <button onClick={() => sellProduct(index)} disabled={product.quantity <= 0}>Sell</button>
                            <button onClick={() => editProduct(index)}>Edit</button>
                            <button onClick={() => deleteProduct(index)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No products available. Please add products first.</p>
                )}
            </ul>
        </div>
    );
}

export default ProductManagement;
