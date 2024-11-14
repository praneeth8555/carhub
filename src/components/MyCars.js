import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cardes from './Cardes';
export default function MyCars() {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail'); // Get the user's email from local storage

    useEffect(() => {
        // Fetch user's cars based on their email
        const fetchMyCars = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/mycars?email=${userEmail}`);
                const data = await response.json();
                if (data.success) {
                    setCars(data.cars);
                } else {
                    alert('Failed to load your cars');
                }
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };

        fetchMyCars();
    }, [userEmail]);

    return (
        <div className="container" style={{ marginTop: '20px' ,paddingBottom:'20px'}}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Your Car Listings</h2>
            {cars.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                    <h4 style={{ color: '#555' }}>No cars found.</h4>
                    <button className="btn btn-primary" onClick={() => navigate('/createcar')}>
                        Add a New Car
                    </button>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    {cars.map(car => (
                        <Cardes key={car._id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
}
