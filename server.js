// server.js - THE BACKEND

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// 1. CONFIGURATION
const PORT = process.env.PORT || 3000;
const API_KEY = '438a576320238ec53e97f7cba35dd91b'; // <--- PASTE YOUR KEY HERE

// Middleware (Parses data coming from the frontend)
app.use(express.json());
app.use(express.static('public')); // Serves your HTML files from a 'public' folder

// Database (Just a simple array for now)
let searchHistory = []; 

// 2. THE ROUTES (What the server listens for)

// ROUTE A: Get Weather
app.post('/get-weather', async (req, res) => {
    const city = req.body.city; // Read city from frontend
    
    if(!city) {
        return res.json({ error: "Please provide a city name" });
    }

    try {
        // A. Ask OpenWeatherMap for data
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);
        const weatherData = response.data;

        // B. Create a tidy object to send back
        const result = {
            city: weatherData.name,
            temp: weatherData.main.temp,
            desc: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon
        };

        // C. Save to our "Database" (History)
        searchHistory.unshift(result); // Add to top of list
        if(searchHistory.length > 5) searchHistory.pop(); // Keep only last 5

        // D. Send answer back to Frontend
        res.json({ success: true, data: result });

    } catch (error) {
        console.log("ERROR DETAILS:", error.response ? error.response.data : error.message);
        res.json({ success: false, error: "City not found or API Error" });
        
    }
});

// ROUTE B: Get History
app.get('/history', (req, res) => {
    res.json(searchHistory);
});

// 3. START THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});
