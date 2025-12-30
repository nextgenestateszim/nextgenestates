// Home page specific JavaScript
function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    const featured = DB.properties.filter(p => p.status === 'active').slice(0, 3);
    grid.innerHTML = featured.map(p => createCard(p)).join('');
}

function handleSearch() {
    const loc = document.getElementById('homeSearch').value;
    const province = document.getElementById('homeProvince').value;
    const type = document.getElementById('homeType').value;
    
    let url = 'listings.html?';
    const params = [];
    
    if(loc) params.push(`search=${encodeURIComponent(loc)}`);
    if(province) params.push(`province=${encodeURIComponent(province)}`);
    if(type) params.push(`type=${encodeURIComponent(type)}`);
    
    window.location.href = url + params.join('&');
}

// Initialize home page
document.addEventListener('DOMContentLoaded', function() {
    renderFeatured();
});