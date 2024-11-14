import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';  
import UserManagement from './UserManagement';
import Login from './Login';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if the user is authenticated on initial load
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="container">
                <h1>Wings Cafe Stock Inventory</h1>

                {isAuthenticated && (
                    <header>
                        <nav>
                            <Link to="/">Dashboard</Link>
                            <Link to="/products">Product Management</Link>
                            <Link to="/stock-management">Stock Management</Link>
                            <Link to="/users">User Management</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </nav>
                    </header>
                )}

                <main>
                    <Routes>
                        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/products" element={isAuthenticated ? <ProductManagement /> : <Navigate to="/login" />} />
                        <Route path="/stock-management" element={isAuthenticated ? <StockManagement /> : <Navigate to="/login" />} />
                        <Route path="/users" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
