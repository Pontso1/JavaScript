const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());  // for parsing application/json

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'wings',
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Routes for Products

// Get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, desc, category, price, quantity } = req.body;
    db.query(
        'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, desc, category, price, quantity],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id: results.insertId, name, desc, category, price, quantity });
        }
    );
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, desc, category, price, quantity } = req.body;
    db.query(
        'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
        [name, desc, category, price, quantity, id],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id, name, desc, category, price, quantity });
        }
    );
});

// Sell a product (reduce quantity by 1)
app.put('/products/sell/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT quantity FROM products WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            res.status(500).send(err || 'Product not found');
            return;
        }
        let quantity = results[0].quantity;
        if (quantity > 0) {
            quantity -= 1;
            db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], (err) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json({ id, quantity });
            });
        } else {
            res.status(400).send('Product is out of stock!');
        }
    });
});

// Add stock to a product
app.put('/products/add-stock/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Add quantity to the current stock
    db.query('SELECT quantity FROM products WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            res.status(500).send(err || 'Product not found');
            return;
        }
        let currentQuantity = results[0].quantity;
        currentQuantity += quantity;
        db.query('UPDATE products SET quantity = ? WHERE id = ?', [currentQuantity, id], (err) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id, quantity: currentQuantity });
        });
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// API Routes for Users

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const { username, password } = req.body; // Ensure these fields exist
    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id: results.insertId, username, password });
        }
    );
});

// Update a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body; // Ensure these fields exist
    db.query(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        [username, password, id],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id, username, password });
        }
    );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});