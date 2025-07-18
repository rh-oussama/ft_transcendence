const btn = document.getElementById("getbtn");

btn.addEventListener("click", async event => {
    try {
        const cityName = document.getElementById("city").value;
        
        if (!cityName.trim()) {
            document.getElementById("resultContainer").innerHTML = "Please enter a city name";
            document.getElementById("resultContainer").style.display = "block";
            return;
        }
        
        document.getElementById("resultContainer").innerHTML = "Loading weather data...";
        document.getElementById("resultContainer").style.display = "block";
        
        const data = await getweather(cityName);
        
        if (data && data.current_weather) {
            const coordinates = await getCityCoordinates(cityName);
            const weather = data.current_weather;
            
            const weatherInfo = `
                <div style="font-family: Arial, sans-serif; padding: 15px; background: #f0f8ff; border-radius: 8px; border-left: 4px solid #007acc;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">Weather in ${coordinates.name}, ${coordinates.country}</h3>
                    <div style="font-size: 24px; font-weight: bold; color: #007acc; margin: 10px 0;">
                        🌡️ ${weather.temperature}°C
                    </div>
                    <div style="color: #666; font-size: 14px;">
                        💨 Wind Speed: ${weather.windspeed} km/h<br>
                        🧭 Wind Direction: ${weather.winddirection}°<br>
                        ⏰ Weather Code: ${weather.weathercode}
                    </div>
                </div>
            `;
            
            document.getElementById("resultContainer").innerHTML = weatherInfo;
            document.getElementById("resultContainer").style.display = "block";
        } else {
            document.getElementById("resultContainer").innerHTML = `
                <div style="color: #ff6b6b; padding: 10px; background: #ffe6e6; border-radius: 5px;">
                    ❌ Weather data not available for this location
                </div>
            `;
            document.getElementById("resultContainer").style.display = "block";
        }
    } catch (error) {
        console.error('Error getting weather:', error);
        document.getElementById("resultContainer").innerHTML = `
            <div style="color: #ff6b6b; padding: 10px; background: #ffe6e6; border-radius: 5px;">
                ❌ Error: ${error.message || 'Unable to fetch weather data'}
            </div>
        `;
        document.getElementById("resultContainer").style.display = "block";
    }
});

async function getCityCoordinates(cityName = "Casablanca") {
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`);
        if (!res.ok) {
            throw new Error(`Unable to find location. Please check the city name.`);
        }
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            throw new Error(`No results found for "${cityName}". Please try a different city name.`);
        }
        const firstResult = data.results[0];
        return {
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
            name: firstResult.name,
            country: firstResult.country
        };
        
    } catch (error) {
        console.error('Error fetching city coordinates:', error);
        throw error;
    }
}

async function getweather(cityName) {
    try {
        const coordinates = await getCityCoordinates(cityName);
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`);
        
        if (!res.ok) {
            throw new Error(`Weather service unavailable. Please try again later.`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}