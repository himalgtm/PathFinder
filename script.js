document.addEventListener('DOMContentLoaded', () => {
    const destinations = [
        { name: 'Paris', country: 'FR', description: 'City of lights.', image: 'img/paris.jpg' },
        { name: 'Tokyo', country: 'JP', description: 'Modern and traditional.', image: 'img/tokyo.jpg' },
        { name: 'New York', country: 'US', description: 'City that never sleeps.', image: 'img/new_york.jpg' },
        { name: 'Dubai', country: 'AE', description: 'Luxury in the desert.', image: 'img/dubai.jpg' },
        { name: 'Sydney', country: 'AU', description: 'Landmarks by the water.', image: 'img/sydney.jpg' },
        { name: 'Athens', country: 'GR', description: 'Birthplace of democracy and ancient ruins.', image: 'img/athens.jpg' },
        { name: 'Banff', country: 'CA', description: 'Majestic mountains and crystal-clear lakes.', image: 'img/banff.jpg' },
        { name: 'Barcelona', country: 'ES', description: 'Gaudi architecture and Mediterranean vibes.', image: 'img/barcelona.jpg' },
        { name: 'Honolulu', country: 'US', description: 'Tropical paradise with pristine beaches.', image: 'img/honolulu.jpg' },
        { name: 'Edinburgh', country: 'GB', description: 'Historic castles and dramatic landscapes.', image: 'img/edinburgh.jpg' },
        { name: 'Maldives', country: 'MV', description: 'Luxurious overwater villas and turquoise waters.', image: 'img/maldives.jpg' },
        { name: 'Milford Sound', country: 'NZ', description: 'Breathtaking fjords and natural beauty.', image: 'img/milford.jpg' },
        { name: 'Kathmandu', country: 'NP', description: 'A rich blend of culture and history.', image: 'img/kathmandu.jpg' },
        { name: 'Berlin', country: 'DE', description: 'A city of history, culture, and modernity.', image: 'img/berlin.jpg' },
        { name: 'Reykjavik', country: 'IS', description: 'Land of fire and ice with geothermal spas.', image: 'img/reykjavik.jpg' },
        { name: 'Santorini', country: 'GR', description: 'Whitewashed houses and stunning sunsets.', image: 'img/santorini.jpg' }
    ];    

    const favorites = [];
    const destinationsContainer = document.getElementById('destinations-container');
    const favoritesContainer = document.getElementById('favorites-container');

    const renderDestinations = async () => {
        destinationsContainer.innerHTML = '';
        for (const dest of destinations) {
            const weather = await fetchWeather(dest.name, dest.country);
            const destinationCard = `
                <div class="destination-card">
                    <img src="${dest.image}" alt="${dest.name}">
                    <h3>${dest.name}</h3>
                    <p>${dest.description}</p>
                    <p>Current Weather: <span class="weather-info">${weather}</span></p>
                    <button onclick="addToFavorites('${dest.name}')">Add to Favorites</button>
                </div>
            `;
            destinationsContainer.insertAdjacentHTML('beforeend', destinationCard);
        }
    };

    // Add to favorites
    window.addToFavorites = (name) => {
        if (!favorites.includes(name)) {
            favorites.push(name);
            renderFavorites();
        }
    };

    // Fetch weather data
    const fetchWeather = async (city, countryCode) => {
        const url = `https://open-weather13.p.rapidapi.com/city/${city}/${countryCode}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'd7a0967e4emsh43e1f8a6166a338p11f337jsn256b488d08b5',
                'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (data.main && data.main.temp) {
            return `${data.main.temp}°F`; // Adjust units as per API response
        } else {
            console.error('Temperature data not found in response:', data);
            return 'Weather unavailable';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'Weather unavailable';
    }
};

    // Event listener for budget calculation
    document.getElementById("calculate-budget").addEventListener("click", async () => {
        const fromLocation = document.getElementById("from-location").value;
        const toLocation = document.getElementById("to-location").value;
        const startDate = document.getElementById("start-date").value;

        const fromLocationData = await fetchLocationData(fromLocation);
        const toLocationData = await fetchLocationData(toLocation);
        const flightPricing = await fetchFlightPricing(fromLocation, toLocation, startDate);

        alert(`
            From: ${fromLocation} (${fromLocationData ? fromLocationData.lat : 'N/A'}, ${fromLocationData ? fromLocationData.lng : 'N/A'})
            To: ${toLocation} (${toLocationData ? toLocationData.lat : 'N/A'}, ${toLocationData ? toLocationData.lng : 'N/A'})
            Start Date: ${startDate}
            Estimated Flight Pricing: ${flightPricing || 'N/A'}
        `);
    });

    // Fetch location data
    async function fetchLocationData(location) {
        const url = `https://opencage-geocoder.p.rapidapi.com/geocode/v1/json?q=${encodeURIComponent(location)}&language=en`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'd7a0967e4emsh43e1f8a6166a338p11f337jsn256b488d08b5',
                'x-rapidapi-host': 'opencage-geocoder.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                return { lat, lng };
            } else {
                console.error('No results found for location:', location);
                return null;
            }
        } catch (error) {
            console.error('Error fetching location data:', error);
            return null;
        }
    }

    // Fetch flight pricing
    async function fetchFlightPricing(fromLocation, toLocation, date) {
        if (!fromLocation || !toLocation) {
            console.error('Invalid location data for flight pricing');
            return null;
        }

        const url = `https://amadeus-api2.p.rapidapi.com/airport-on-time-performance?airportCode=${encodeURIComponent(fromLocation)}&date=${date}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'd7a0967e4emsh43e1f8a6166a338p11f337jsn256b488d08b5',
                'x-rapidapi-host': 'amadeus-api2.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data && data.data ? `$${data.data.price}` : `Approx. $${Math.floor(Math.random() * 1000) + 200}`;
        } catch (error) {
            console.error('Error fetching flight pricing data:', error);
            return `Approx. $${Math.floor(Math.random() * 1000) + 200}`;
        }
    }
    const renderFavorites = () => {
        favoritesContainer.innerHTML = favorites.map(fav => `
            <div class="destination-card">
                <h3>${fav}</h3>
            </div>
        `).join('');
    };

    window.addToFavorites = (name) => {
        if (!favorites.includes(name)) {
            favorites.push(name);
            renderFavorites();
        }
    };

    renderDestinations();
});