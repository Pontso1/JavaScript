import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StockManagement() {
    const [products, setProducts] = useState([]);
    const [stockUpdate, setStockUpdate] = useState({ productId: '', quantity: '' });
    const navigate = useNavigate();

    // Check authentication before accessing stock management
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    // Fetch all products from backend
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStockUpdate({ ...stockUpdate, [name]: value });
    };

    // Update stock (Add stock)
    const updateStock = (e) => {
        e.preventDefault();
        const { productId, quantity } = stockUpdate;
        if (!productId || !quantity) {
            return;
        }
        fetch(`http://localhost:5000/products/add-stock/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: parseInt(quantity, 10) }),
        })
            .then(response => response.json())
            .then(updatedProduct => {
                const updatedProducts = products.map(product => 
                    product.id === updatedProduct.id ? updatedProduct : product
                );
                setProducts(updatedProducts);
                setStockUpdate({ productId: '', quantity: '' });
            })
            .catch(error => console.error('Error updating stock:', error));
    };

    return (
        <div id="stock-management">
            <h2>Stock Management</h2>

            {/* Stock update form */}
            <form onSubmit={updateStock}>
                <select 
                    name="productId"
                    value={stockUpdate.productId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="quantity"
                    value={stockUpdate.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity to Add"
                    required
                />
                <button type="submit">Update Stock</button>
            </form>

            <h3>Product List</h3>
{products.length > 0 ? (
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            {products.map(product => (
                <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                </tr>
            ))}
        </tbody>
    </table>
) : (
    <p>No products available. Please add products first.</p>
)}

        </div>
    );
}

export default StockManagement;
