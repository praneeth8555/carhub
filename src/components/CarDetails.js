import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

export default function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // New state to track upload status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`https://carhubbackend.onrender.com/api/cars/${id}`);
                const data = await response.json();
                if (data.success) {
                    setCar(data.car);
                } else {
                    alert('Failed to load car details');
                }
            } catch (error) {
                console.error("Error fetching car details:", error);
            }
        };

        fetchCarDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCar({ ...car, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`https://carhubbackend.onrender.com/api/cars/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(car),
            });
            const data = await response.json();
            if (data.success) {
                alert('Car details updated successfully');
                setIsEditing(false);
            } else {
                alert('Failed to update car details');
            }
        } catch (error) {
            console.error("Error updating car details:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            try {
                const response = await fetch(`https://carhubbackend.onrender.com/api/cars/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    alert('Car deleted successfully');
                    navigate('/');
                } else {
                    alert('Failed to delete car');
                }
            } catch (error) {
                console.error("Error deleting car:", error);
            }
        }
    };

    const handleImageUpload = async () => {
        if (!newImage) {
            alert('Please select an image to upload');
            return;
        }
        if (car.images.length >= 10) {
            alert('You cannot upload more than 10 images.');
            return;
        }

        setIsUploading(true); // Start uploading, disable button
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('upload_preset', 'chatfusion');
        formData.append('cloud_name', 'dzrcalore');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dzrcalore/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.url) {
                const updatedImages = [...car.images, data.url];
                const updateResponse = await fetch(`https://carhubbackend.onrender.com/api/cars/${car._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageUrls: updatedImages,
                    }),
                });

                if (updateResponse.ok) {
                    const updatedCar = await updateResponse.json();
                    setCar(updatedCar.car);
                    alert('Image uploaded and car updated successfully');
                } else {
                    const errorData = await updateResponse.json();
                    alert(`Failed to update car images: ${errorData.message}`);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false); // Upload complete, re-enable button
        }
    };

    const handleImageDelete = async (imageUrl) => {
        if (car.images.length <= 1) {
            alert('You cannot delete all images. At least one image must remain.');
            return;
        }

        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                const updatedImages = car.images.filter((img) => img !== imageUrl);
                const response = await fetch(`https://carhubbackend.onrender.com/api/cars/${car._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageUrls: updatedImages,
                    }),
                });

                if (response.ok) {
                    const updatedCar = await response.json();
                    setCar(updatedCar.car);
                    alert('Image deleted and car updated successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update car images: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error deleting image:", error);
                alert('Failed to delete image');
            }
        }
    };

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    if (!car) return <div>Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="container" style={{ marginTop: '20px',paddingBottom:'20px' }}>
                <h2>Car Details</h2>

                <form>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={car.title}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={car.description}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            className="form-control"
                            value={car.tags.join(', ')}
                            onChange={(e) => handleChange({
                                target: { name: 'tags', value: e.target.value.split(',').map(tag => tag.trim()) }
                            })}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Images</label>
                        <div className="row">
                            {car.images && car.images.map((image, index) => (
                                <div key={index} className="col-4">
                                    <img src={image} alt={`Car ${index + 1}`} className="img-fluid" />
                                    {isEditing && (
                                        <button
                                            type="button"
                                            className="btn btn-danger mt-2"
                                            onClick={() => handleImageDelete(image)}
                                        >
                                            Delete Image
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mb-3">
                            <label className="form-label">Upload New Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                disabled={isUploading} // Disable input while uploading
                            />
                            <button
                                type="button"
                                className="btn btn-success mt-2"
                                onClick={handleImageUpload}
                                disabled={isUploading} // Disable button while uploading
                            >
                                {isUploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ marginRight: '10px' }}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn btn-success" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                        style={{ marginLeft: '10px' }}
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}
