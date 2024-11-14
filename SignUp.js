import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();

        // Get the users from localStorage (or an empty array if none exist)
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username already exists
        const userExists = storedUsers.find(user => user.username === username);

        if (userExists) {
            alert('Username already exists! Please choose a different username.');
        } else {
            // Create a new user object and add it to the users array
            const newUser = { username, password };
            storedUsers.push(newUser);

            // Save the updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(storedUsers));

            // Mark the user as authenticated and update the state
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);

            // Redirect to the Dashboard after successful sign-up
            navigate('/');
        }
    };

    return (
        <div id="signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
