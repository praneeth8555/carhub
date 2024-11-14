import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import Cardes from '../components/Cardes';
import Navbar from "./navbar";

const SkeletonCard = () => (
    <div
        className="card-skeleton"
        style={{
            width: '18%',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 5px 7px rgba(0, 0, 0, 0.2)',
            margin: '10px',
        }}
    >
        {/* Image Skeleton */}
        <div className="placeholder-glow">
            <span
                className="placeholder bg-secondary"
                style={{ display: 'block', height: '10rem', borderRadius: '4px' }}
            ></span>
        </div>

        {/* Divider */}
        <hr style={{ margin: '0', borderColor: '#ccc' }} />

        {/* Content Skeleton */}
        <div className="p-3">
            {/* Title Skeleton */}
            <div className="placeholder-glow">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '20px', width: '80%', borderRadius: '4px', marginBottom: '1rem' }}
                ></span>
            </div>

            {/* Text Skeleton */}
            <div className="placeholder-glow">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '15px', width: '100%', borderRadius: '4px', marginBottom: '1rem' }}
                ></span>
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '15px', width: '100%', borderRadius: '4px' }}
                ></span>
            </div>

            {/* Button Skeletons */}
            <div className="d-flex gap-2 mt-4">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '40px', width: '80px', borderRadius: '4px' }}
                ></span>
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '40px', width: '100px', borderRadius: '4px' }}
                ></span>
            </div>
        </div>
    </div>
);

export default function SearchResults() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('q');


    const userEmail = localStorage.getItem('userEmail');  // Get userEmail from localStorage

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                // Ensure userEmail is available
                if (!userEmail) {
                    throw new Error("User email is not found.");
                }

                // Set headers including the userEmail
                const response = await fetch(`https://carhubbackend.onrender.com/api/search?q=${searchTerm}`, {
                    method: 'POST',  // Assuming GET method for search
                    headers: {
                        'Content-Type': 'application/json',
                        'userEmail': userEmail,  // Add userEmail in the headers
                    },
                });

                const data = await response.json();
                setSearchResults(data);

            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            } finally {
                setLoading(false);  // Set loading to false after fetching is done
            }
        };

        if (searchTerm) {
            setLoading(true);  // Set loading to true when fetching begins
            fetchSearchResults();
        }
    }, [searchTerm, userEmail]);  // Re-run effect if searchTerm or userEmail changes

    return (
        <div>
            <Navbar />

            <div style={{ marginTop: "70px", textAlign: "center" }}>
                <h2>Search Results for "{searchTerm}"</h2>
                <div
                    className="search-results"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "55px",
                        flexWrap: "wrap",
                        width: "100%", // Ensure the container takes up full width
                        
                        alignItems: "center", // Centers the content vertically
                    }}
                >
                    {loading ? (
                        // Render 4 skeleton cards while loading
                        Array(5).fill(0).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <div key={product._id} style={{ margin: "10px" }}>
                                <Cardes car={product} />
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
