import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle login
    const handleLogin = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            navigate('/stock-management'); // Redirect to Stock Management after login
        } else {
            setError('Invalid username or password!');
        }
    };

    // Handle signup
    const handleSignup = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.username === username);

        if (userExists) {
            setError('Username already exists!');
        } else {
            // Add new user to local storage
            const newUser = { username, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            setError('');
            setUsername('');
            setPassword('');
            setIsLogin(true); // After signup, switch back to login form
        }
    };

    return (
        <div id="login-form">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
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
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            {error && <div className="error">{error}</div>}
            <div>
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Create an Account' : 'Already have an Account? Login'}
                </button>
            </div>
        </div>
    );
}

export default Login;
