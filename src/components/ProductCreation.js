import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signupform.css'; // Reuse existing styles or add new ones
import Navbar from './navbar';

export default function ProductCreation() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
    });
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    // Upload each image to Cloudinary and store the URLs
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 10) {
            alert('You can only upload up to 10 images.');
            return;
        }

        setLoading(true);
        const uploadPromises = files.map((file) => uploadToCloudinary(file));

        try {
            const urls = await Promise.all(uploadPromises);
            setImageUrls(urls);
            setLoading(false);
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("An error occurred while uploading images.");
            setLoading(false);
        }
    };

    // Helper function to upload an image to Cloudinary
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'chatfusion'); // Replace with your upload preset
        data.append('cloud_name', 'dzrcalore'); // Replace with your Cloudinary cloud name

        const response = await fetch('https://api.cloudinary.com/v1_1/dzrcalore/image/upload', {
            method: 'POST',
            body: data,
        });
        const result = await response.json();
        return result.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            alert('User email not found in localStorage');
            return;
        }

        const data = {
            ...formData,
            email: userEmail,
            imageUrls,
        };

        try {
            const response = await fetch("http://localhost:3000/api/createproduct", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                alert('Product created successfully!');
                navigate('/'); // Redirect to product list page
            } else {
                alert('Failed to create product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the product.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Navbar/>
        
        <div className="container" style={{ width: '600px', marginTop: '70px' }}>
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-heading">Add New Car</h2>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g., car_type, company, dealer"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="images" className="form-label">Upload Images (up to 10)</label>
                    <input
                        type="file"
                        className="form-control"
                        name="images"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        required
                    />
                </div>

                <button type="submit" className="btn btn-shadow" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit'}
                </button>
            </form>
        </div>
        </div>
    );
}
