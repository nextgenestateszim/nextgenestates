// Listings page specific JavaScript
let map = null;
let markers = [];

function populateCitySelect() {
    const provinceSelect = document.getElementById('filterProvince');
    const citySelect = document.getElementById('filterCity');
    
    if (!provinceSelect || !citySelect) return;
    
    provinceSelect.addEventListener('change', function() {
        const province = this.value;
        citySelect.innerHTML = '<option value="">All Cities</option>';
        
        if (province && DB.cities[province]) {
            DB.cities[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    });
}

function initializeMap() {
    if (document.getElementById('interactiveMap')) {
        if (map) {
            map.remove();
            markers.forEach(marker => marker.remove());
            markers = [];
        }
        
        map = L.map('interactiveMap').setView([-17.83, 31.05], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);
        
        // Add markers for all active properties
        DB.properties.filter(p => p.status === 'active').forEach(property => {
            if (property.coordinates) {
                const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
                    .addTo(map)
                    .bindPopup(`
                        <strong>${property.title}</strong><br>
                        ${property.loc}<br>
                        $${property.price.toLocaleString()}${property.category === 'rent' ? '/month' : ''}<br>
                        <button onclick="window.location.href='property-detail.html?id=${property.id}'" style="background: #0A5F8B; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">
                            View Details
                        </button>
                    `);
                markers.push(marker);
            }
        });
    }
}

function renderListings(items = DB.properties) {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;
    
    if(items.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-text);">No properties found. Try adjusting your filters.</div>`;
        return;
    }
    
    const activeItems = items.filter(p => p.status === 'active');
    if(activeItems.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-text);">No active properties found.</div>`;
        return;
    }
    
    grid.innerHTML = activeItems.map(p => createCard(p)).join('');
}

function applyFilters() {
    const cat = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;
    const province = document.getElementById('filterProvince').value;
    const city = document.getElementById('filterCity').value;
    const loc = document.getElementById('filterLoc').value.toLowerCase();
    const sort = document.getElementById('filterSort').value;
    const minPrice = parseInt(document.getElementById('filterMinPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('filterMaxPrice').value) || Infinity;
    const minBeds = parseInt(document.getElementById('filterBeds').value) || 0;
    const minBaths = parseInt(document.getElementById('filterBaths').value) || 0;

    let filtered = DB.properties.filter(p => {
        const matchCat = cat === 'all' || p.category === cat;
        const matchType = !type || p.type === type;
        const matchProvince = !province || p.province === province;
        const matchCity = !city || p.city === city;
        const matchLoc = !loc || 
            p.loc.toLowerCase().includes(loc) || 
            p.title.toLowerCase().includes(loc) ||
            p.city.toLowerCase().includes(loc);
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        const matchBeds = p.beds >= minBeds;
        const matchBaths = p.baths >= minBaths;
        const matchStatus = p.status === 'active';

        return matchCat && matchType && matchProvince && matchCity && matchLoc && matchPrice && matchBeds && matchBaths && matchStatus;
    });

    if (sort === 'priceLow') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'sizeHigh') filtered.sort((a, b) => b.area - a.area);
    if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderListings(filtered);
    
    // Update map markers
    if (map) {
        markers.forEach(marker => marker.remove());
        markers = [];
        
        filtered.forEach(property => {
            if (property.coordinates) {
                const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
                    .addTo(map)
                    .bindPopup(`
                        <strong>${property.title}</strong><br>
                        ${property.loc}<br>
                        $${property.price.toLocaleString()}${property.category === 'rent' ? '/month' : ''}<br>
                        <button onclick="window.location.href='property-detail.html?id=${property.id}'" style="background: #0A5F8B; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">
                            View Details
                        </button>
                    `);
                markers.push(marker);
            }
        });
    }
}

function toggleView(mode) {
    const btns = document.querySelectorAll('.view-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if(mode === 'map') {
        document.getElementById('listingsGrid').style.display = 'none';
        document.getElementById('mapView').style.display = 'block';
        // Reinitialize map when switching to map view
        setTimeout(initializeMap, 100);
    } else {
        document.getElementById('listingsGrid').style.display = 'grid';
        document.getElementById('mapView').style.display = 'none';
    }
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
}

// Initialize listings page
document.addEventListener('DOMContentLoaded', function() {
    populateCitySelect();
    renderListings();
    initializeMap();
    
    // Apply filters from URL parameters
    const params = getUrlParams();
    if (params.category) {
        document.getElementById('filterCategory').value = params.category;
    }
    if (params.search) {
        document.getElementById('filterLoc').value = params.search;
    }
    if (params.province) {
        document.getElementById('filterProvince').value = params.province;
    }
    if (params.type) {
        document.getElementById('filterType').value = params.type;
    }
    
    if (params.category || params.search || params.province || params.type) {
        applyFilters();
    }
});