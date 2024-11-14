import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Import images (make sure these paths are correct)
import image1 from './switch-original-6x500ml.jpg'; // Correct path to your images
import image2 from './orange-oranges-fruit-sweet-food-wallpaper.jpg';
import image3 from './product-motoho-q8ogaa3a2ba6q99139m5dildxsxqqd4ln601606234.png';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [productData, setProductData] = useState([]);

    // Fetch product data from the backend
    useEffect(() => {
        fetch('http://localhost:5000/products') // Ensure this URL matches your backend endpoint
            .then(response => response.json())
            .then(data => setProductData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Prepare data for the bar chart
    const chartData = {
        labels: productData.map(product => product.name),
        datasets: [
            {
                label: 'Stock Quantity',
                data: productData.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    // Array of images to display in the rotating effect
    const images = [image1, image2, image3];

    return (
        <div>
            <h2>Product Stock Levels</h2>
            {productData.length > 0 ? (
                <Bar data={chartData} />
            ) : (
                <p>Loading chart data...</p>
            )}

            <h2>Featured Products</h2>

            {/* Add the rotating effect */}
            <div className="rotating-images-container">
                {images.map((src, index) => (
                    <div key={index} className="rotating-image">
                        <img src={src} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
