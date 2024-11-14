// src/api.js

const API_URL_PRODUCTS = 'http://localhost:5000/products';
const API_URL_USERS = 'http://localhost:5000/users';

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL_PRODUCTS);
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product) => {
  try {
    const response = await fetch(API_URL_PRODUCTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id, updatedProduct) => {
  try {
    await fetch(`${API_URL_PRODUCTS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await fetch(`${API_URL_PRODUCTS}/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL_USERS);
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Add a new user
export const addUser = async (user) => {
  try {
    const response = await fetch(API_URL_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (id, updatedUser) => {
  try {
    await fetch(`${API_URL_USERS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    await fetch(`${API_URL_USERS}/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
