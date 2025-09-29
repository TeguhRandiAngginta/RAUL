import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/v1/users/profile', { withCredentials: true })
            .then(response => {
                if (response.data.role !== 'admin') {
                    navigate('/signin'); // Redirect jika bukan admin
                } else {
                    setUser(response.data);
                }
            })
            .catch(() => navigate('/signin'));
    }, [navigate]);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.username}!</p>
        </div>
    );
};

export default AdminDashboard;
