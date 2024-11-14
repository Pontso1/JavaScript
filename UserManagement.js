import React, { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', username: '', password: '' });
  const [editIndex, setEditIndex] = useState(-1);

  // Fetch all users from backend
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };

  // Add or Update user
  const addOrUpdateUser = (e) => {
    e.preventDefault();
    const url = editIndex === -1 ? 'http://localhost:5000/users' : `http://localhost:5000/users/${users[editIndex].id}`;

    fetch(url, {
      method: editIndex === -1 ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(newUser => {
        const updatedUsers = [...users];
        if (editIndex === -1) {
          updatedUsers.push(newUser);
        } else {
          updatedUsers[editIndex] = newUser;
          setEditIndex(-1);
        }
        setUsers(updatedUsers);
        setUser({ name: '', email: '', username: '', password: '' });
      })
      .catch(error => console.error('Error adding/updating user:', error));
  };

  // Edit a user (populate form)
  const editUser = (index) => {
    setEditIndex(index);
    setUser({ ...users[index] });
  };

  // Delete a user
  const deleteUser = (index) => {
    const userId = users[index].id;
    fetch(`http://localhost:5000/users/${userId}`, { method: 'DELETE' })
      .then(() => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div id="user-management">
      <h2>User Management</h2>
      <form onSubmit={addOrUpdateUser}>
        <input
          type="text"
          id="name"
          placeholder="Name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={user.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={user.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={user.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editIndex === -1 ? 'Add User' : 'Update User'}</button>
      </form>

      <h3>User List</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => (
            <li key={index}>
              <span>{user.name} - {user.username}</span>
              <button onClick={() => editUser(index)}>Edit</button>
              <button onClick={() => deleteUser(index)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No users available. Please add users first.</p>
        )}
      </ul>
    </div>
  );
}

export default UserManagement;
