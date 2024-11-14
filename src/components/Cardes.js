import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cardes.css'; // Import the updated styles

const Cardes = ({ car }) => {
    const navigate = useNavigate();

    return (
        <div className="col-md-4" style={{ marginBottom: '20px' }}>
            <div className="card card-hover" style={{ width: "20rem", borderRadius: '12px' }}>
                <div className="card-image-container" style={{ position: 'relative' }}>
                    <div
                        className="carousel slide"
                        id={`carousel-${car._id}`}
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner">
                            {car.images.map((image, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img
                                        src={image}
                                        alt={car.title}
                                        className="d-block w-100"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {car.images.length > 1 && (
                            <>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className="view-details-btn"
                        onClick={() => navigate(`/car/${car._id}`)}
                    >
                        Details
                    </button>
                </div>
                <div className="card-body" style={{ padding: '10px' }}>
                    <h5 className="card-title">{car.title}</h5>
                    <p className="card-text">{car.description}</p>
                    <div className="tags">
                        {car.tags.map((tag, index) => (
                            <span key={index} className="tag-btn">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cardes;
