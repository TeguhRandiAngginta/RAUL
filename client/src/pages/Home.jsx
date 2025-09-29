// Import komponen dari React dan Bootstrap
import React from 'react';
import Button from 'react-bootstrap/Button';

export default function Home() {
    return (
        <div className="p-4">
            <h1>Home</h1>
            <Button className="btn btn-success">Click me</Button>
        </div>
    );
}