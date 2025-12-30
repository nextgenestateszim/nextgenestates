// Dashboard specific JavaScript
function enterDashboard() {
    if(!currentUser) {
        openAuthModal();
        return;
    }
    
    document.getElementById('dashName').innerText = currentUser.name;
    document.getElementById('dashRole').innerText = currentUser.role;
    document.getElementById('dashAvatar').innerText = currentUser.avatar;

    // Generate Menu based on Role
    const menu = document.getElementById('dashNav');
    let items = '';
    
    // Common items
    items += `<a onclick="renderDashView('overview')" class="dash-menu-item active"><i class="fas fa-chart-pie"></i> Overview</a>`;
    items += `<a onclick="renderDashView('favorites')" class="dash-menu-item"><i class="fas fa-heart"></i> Saved Properties</a>`;
    
    // Owner/Admin specific
    if(['owner', 'admin'].includes(currentUser.role)) {
        items += `
            <a onclick="renderDashView('properties')" class="dash-menu-item"><i class="fas fa-building"></i> Manage Properties</a>
            <a onclick="openManageUsers()" class="dash-menu-item"><i class="fas fa-users"></i> Manage Users</a>
            <a onclick="renderDashView('requests')" class="dash-menu-item"><i class="fas fa-user-clock"></i> Access Requests</a>
            <a onclick="renderDashView('pipeline')" class="dash-menu-item"><i class="fas fa-stream"></i> Sales Pipeline</a>
        `;
    }
    
    // Agent specific
    if(currentUser.role === 'agent') {
        items += `
            <a onclick="renderDashView('myproperties')" class="dash-menu-item"><i class="fas fa-home"></i> My Properties</a>
            <a onclick="renderDashView('addproperty')" class="dash-menu-item"><i class="fas fa-plus-circle"></i> Add Property</a>
        `;
    }
    
    // Visitor specific
    if(currentUser.role === 'visitor') {
        items += `<a onclick="openRequestAccessModal()" class="dash-menu-item"><i class="fas fa-briefcase"></i> Become Agent</a>`;
    }
    
    items += `<a onclick="logout()" class="dash-menu-item" style="color: var(--danger); margin-top: 2rem;"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
    
    menu.innerHTML = items;
    renderDashView('overview');
}

function renderDashView(view) {
    const content = document.getElementById('dashContent');
    if (!content) return;
    
    const menuItems = document.querySelectorAll('.dash-menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the clicked menu item
    event?.target.classList.add('active');
    
    if(view === 'overview') {
        const totalProperties = DB.properties.length;
        const activeProperties = DB.properties.filter(p => p.status === 'active').length;
        const totalUsers = DB.users.length;
        const pendingRequests = DB.requests.filter(r => r.status === 'pending').length;
        const totalSales = DB.properties.filter(p => p.category === 'sale' && p.status === 'sold').length;
        const totalRevenue = DB.properties
            .filter(p => p.status === 'sold')
            .reduce((sum, p) => sum + p.price, 0);
        
        content.innerHTML = `
            <h2 style="margin-bottom: 2rem;">Dashboard Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card" style="padding: 1.5rem;">
                    <p style="color: var(--gray-text);">Total Properties</p>
                    <h2 class="text-primary">${totalProperties}</h2>
                    <small style="color: var(--success);">${activeProperties} Active</small>
                </div>
                <div class="card" style="padding: 1.5rem;">
                    <p style="color: var(--gray-text);">System Users</p>
                    <h2 class="text-primary">${totalUsers}</h2>
                </div>
                <div class="card" style="padding: 1.5rem;">
                    <p style="color: var(--gray-text);">Pending Requests</p>
                    <h2 class="text-primary">${pendingRequests}</h2>
                </div>
                <div class="card" style="padding: 1.5rem;">
                    <p style="color: var(--gray-text);">Total Sales</p>
                    <h2 class="text-primary">${totalSales}</h2>
                    <small style="color: var(--primary);">$${totalRevenue.toLocaleString()} Revenue</small>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <div class="card" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1rem;">Recent Properties</h3>
                    ${DB.properties.slice(-5).reverse().map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                            <div>
                                <strong>${p.title}</strong>
                                <div style="font-size: 0.8rem; color: var(--gray-text);">${p.loc}</div>
                            </div>
                            <span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-warning'}">${p.status}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="card" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1rem;">Quick Stats</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>For Sale:</span>
                            <strong class="text-primary">${DB.properties.filter(p => p.category === 'sale' && p.status === 'active').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>For Rent:</span>
                            <strong class="text-primary">${DB.properties.filter(p => p.category === 'rent' && p.status === 'active').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Student Properties:</span>
                            <strong class="text-primary">${DB.properties.filter(p => p.category === 'student' && p.status === 'active').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Active Agents:</span>
                            <strong class="text-primary">${DB.users.filter(u => u.role === 'agent' && u.status === 'active').length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    else if(view === 'properties') {
        const userProperties = ['owner', 'admin'].includes(currentUser.role) ? 
            DB.properties : 
            DB.properties.filter(p => p.agentId === currentUser.id);
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Manage Properties</h2>
                <button onclick="openAddPropertyModal()" class="btn btn-accent">
                    <i class="fas fa-plus"></i> Add Property
                </button>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Agent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userProperties.map(p => {
                            const agent = DB.users.find(u => u.id === p.agentId) || { name: 'Unassigned' };
                            return `
                                <tr>
                                    <td>
                                        <strong>${p.title}</strong><br>
                                        <small style="color: var(--gray-text);">ID: ${p.id}</small>
                                    </td>
                                    <td>${p.loc}, ${p.city}</td>
                                    <td>${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</td>
                                    <td class="text-primary">$${p.price.toLocaleString()}${p.category === 'rent' ? '/month' : ''}</td>
                                    <td>
                                        <span class="badge ${p.status === 'active' ? 'badge-success' : p.status === 'sold' ? 'badge-warning' : 'badge-danger'}">
                                            ${p.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>${agent.name}</td>
                                    <td class="action-buttons">
                                        <a href="property-detail.html?id=${p.id}" class="btn btn-sm btn-outline">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <button onclick="editProperty(${p.id})" class="btn btn-sm btn-outline">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteProperty(${p.id})" class="btn btn-sm btn-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    else if(view === 'favorites') {
        const favorites = currentUser.favorites || [];
        const favoriteProperties = DB.properties.filter(p => favorites.includes(p.id));
        
        content.innerHTML = `
            <h2 style="margin-bottom: 2rem;">Saved Properties</h2>
            ${favoriteProperties.length > 0 ? `
                <div class="grid">
                    ${favoriteProperties.map(p => createCard(p)).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 3rem; color: var(--gray-text);">
                    <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border);"></i>
                    <h3>No saved properties</h3>
                    <p>Browse properties and click the heart icon to save them here.</p>
                    <a href="listings.html" class="btn btn-accent" style="margin-top: 1rem;">Browse Properties</a>
                </div>
            `}
        `;
    }
    else if(view === 'requests') {
        content.innerHTML = `
            <h2 style="margin-bottom: 2rem;">Access Requests</h2>
            ${DB.requests.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Desired Role</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB.requests.map(req => `
                                <tr>
                                    <td>${req.name}</td>
                                    <td>${req.email}</td>
                                    <td>${req.phone}</td>
                                    <td>${req.desiredRole}</td>
                                    <td>${new Date(req.date).toLocaleDateString()}</td>
                                    <td>
                                        <span class="badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'approved' ? 'badge-success' : 'badge-danger'}">
                                            ${req.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="action-buttons">
                                        ${req.status === 'pending' ? `
                                            <button onclick="approveRequest(${req.id})" class="btn btn-sm btn-success">
                                                <i class="fas fa-check"></i> Approve
                                            </button>
                                            <button onclick="rejectRequest(${req.id})" class="btn btn-sm btn-danger">
                                                <i class="fas fa-times"></i> Reject
                                            </button>
                                        ` : ''}
                                        <button onclick="viewRequestDetails(${req.id})" class="btn btn-sm btn-outline">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div style="text-align: center; padding: 3rem; color: var(--gray-text);">
                    <i class="fas fa-user-clock" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border);"></i>
                    <h3>No pending requests</h3>
                    <p>All access requests have been processed.</p>
                </div>
            `}
        `;
    }
    else if(view === 'pipeline') {
        content.innerHTML = `
            <h2 style="margin-bottom: 2rem;">Sales Pipeline</h2>
            <div class="kanban-board">
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span>Leads</span>
                        <span style="background: var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                            ${DB.pipeline.filter(p => p.stage === 'lead').length}
                        </span>
                    </div>
                    ${DB.pipeline.filter(p => p.stage === 'lead').map(p => `
                        <div class="kanban-card">
                            <h4>${p.title}</h4>
                            <p style="font-size: 0.8rem; color: var(--gray-text);">Value: ${p.value}</p>
                            <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                                <span>${p.agent}</span>
                                <span class="text-primary">Hot</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span>Negotiation</span>
                        <span style="background: var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                            ${DB.pipeline.filter(p => p.stage === 'negotiation').length}
                        </span>
                    </div>
                    ${DB.pipeline.filter(p => p.stage === 'negotiation').map(p => `
                        <div class="kanban-card">
                            <h4>${p.title}</h4>
                            <p style="font-size: 0.8rem; color: var(--gray-text);">Value: ${p.value}</p>
                            <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                                <span>${p.agent}</span>
                                <span style="color: var(--warning);">In Progress</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="kanban-col">
                    <div class="kanban-header">
                        <span>Closed Won</span>
                        <span style="background: var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                            ${DB.pipeline.filter(p => p.stage === 'sold').length}
                        </span>
                    </div>
                    ${DB.pipeline.filter(p => p.stage === 'sold').map(p => `
                        <div class="kanban-card" style="border-color: var(--success);">
                            <h4>${p.title}</h4>
                            <p style="font-size: 0.8rem; color: var(--gray-text);">Value: ${p.value}</p>
                            <div style="margin-top: 10px; font-size: 0.8rem;">
                                <span>${p.agent}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if(view === 'myproperties') {
        const myProperties = DB.properties.filter(p => p.agentId === currentUser.id);
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>My Properties</h2>
                <button onclick="openAddPropertyModal()" class="btn btn-accent">
                    <i class="fas fa-plus"></i> Add Property
                </button>
            </div>
            
            ${myProperties.length > 0 ? `
                <div class="grid">
                    ${myProperties.map(p => createCard(p)).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 3rem; color: var(--gray-text);">
                    <i class="fas fa-home" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border);"></i>
                    <h3>No properties assigned</h3>
                    <p>You haven't been assigned any properties yet.</p>
                    <button onclick="openAddPropertyModal()" class="btn btn-accent" style="margin-top: 1rem;">Add Your First Property</button>
                </div>
            `}
        `;
    }
    else if(view === 'addproperty') {
        openAddPropertyModal();
    }
}

function openAddPropertyModal(propertyId = null) {
    const modal = document.getElementById('addPropertyModal');
    if (!modal) return;
    
    editPropertyId = propertyId;
    const modalTitle = propertyId ? 'Edit Property' : 'Add New Property';
    document.querySelector('#addPropertyModal .modal-header h2').textContent = modalTitle;
    
    const formContent = document.getElementById('propertyFormContent');
    const agents = DB.users.filter(u => u.role === 'agent' || u.role === 'admin' || u.role === 'owner');
    
    let property = null;
    if (propertyId) {
        property = DB.properties.find(p => p.id === propertyId);
    }
    
    // NOTE: Changed city selection from dropdown to text input
    formContent.innerHTML = `
        <div class="upload-section">
            <h3>Basic Information</h3>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Property Title *</label>
                    <input type="text" id="propTitle" value="${property ? property.title : ''}" required class="auth-input">
                </div>
                <div class="form-group">
                    <label>Listing Type *</label>
                    <select id="propCategory" required class="auth-input">
                        <option value="">Select</option>
                        <option value="sale" ${property && property.category === 'sale' ? 'selected' : ''}>For Sale</option>
                        <option value="rent" ${property && property.category === 'rent' ? 'selected' : ''}>For Rent</option>
                        <option value="student" ${property && property.category === 'student' ? 'selected' : ''}>Student Accommodation</option>
                        <option value="commercial" ${property && property.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                    </select>
                </div>
            </div>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Property Type *</label>
                    <select id="propType" required class="auth-input">
                        <option value="">Select</option>
                        ${DB.propertyTypes.map(type => `
                            <option value="${type.toLowerCase()}" ${property && property.type === type.toLowerCase() ? 'selected' : ''}>
                                ${type}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Price ($) *</label>
                    <input type="number" id="propPrice" value="${property ? property.price : ''}" required min="0" class="auth-input">
                </div>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Location Details</h3>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Province *</label>
                    <select id="propProvince" required class="auth-input">
                        <option value="">Select Province</option>
                        ${Object.keys(DB.cities).map(prov => `
                            <option value="${prov}" ${property && property.province === prov ? 'selected' : ''}>${prov}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>City *</label>
                    <!-- CHANGED: Text input instead of dropdown -->
                    <input type="text" id="propCity" value="${property ? property.city : ''}" required class="auth-input" placeholder="Enter city name">
                </div>
            </div>
            <div class="form-group">
                <label>Suburb/Area *</label>
                <input type="text" id="propLocation" value="${property ? property.loc : ''}" required class="auth-input">
            </div>
            <div class="form-group">
                <label>Exact Address (Optional)</label>
                <input type="text" id="propAddress" value="${property ? property.address || '' : ''}" class="auth-input">
            </div>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Latitude (for map)</label>
                    <input type="number" step="any" id="propLat" value="${property && property.coordinates ? property.coordinates.lat : '-17.83'}" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Longitude (for map)</label>
                    <input type="number" step="any" id="propLng" value="${property && property.coordinates ? property.coordinates.lng : '31.05'}" class="auth-input">
                </div>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Property Features</h3>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Bedrooms *</label>
                    <input type="number" id="propBeds" value="${property ? property.beds : ''}" required min="0" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Bathrooms *</label>
                    <input type="number" id="propBaths" value="${property ? property.baths : ''}" required min="0" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Parking Spaces</label>
                    <input type="number" id="propParking" value="${property && property.features ? property.features.parking || 0 : 0}" min="0" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Total Area (m²) *</label>
                    <input type="number" id="propArea" value="${property ? property.area : ''}" required min="0" class="auth-input">
                </div>
            </div>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Kitchen Type</label>
                    <input type="text" id="propKitchen" value="${property && property.features ? property.features.kitchen || '' : ''}" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Furnished</label>
                    <select id="propFurnished" class="auth-input">
                        <option value="">Select</option>
                        <option value="true" ${property && property.features && property.features.furnished === true ? 'selected' : ''}>Yes</option>
                        <option value="false" ${property && property.features && property.features.furnished === false ? 'selected' : ''}>No</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Utilities & Security</h3>
            <div class="form-group">
                <label>Power Supply (Select all applicable)</label>
                <div class="checkbox-group" id="powerCheckboxes">
                    ${DB.powerOptions.map(option => `
                        <label class="checkbox-label">
                            <input type="checkbox" name="power" value="${option}"
                                ${property && property.features && property.features.power && property.features.power.includes(option) ? 'checked' : ''}>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label>Water Supply (Select all applicable)</label>
                <div class="checkbox-group" id="waterCheckboxes">
                    ${DB.waterOptions.map(option => `
                        <label class="checkbox-label">
                            <input type="checkbox" name="water" value="${option}"
                                ${property && property.features && property.features.water && property.features.water.includes(option) ? 'checked' : ''}>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label>Security Features (Select all applicable)</label>
                <div class="checkbox-group" id="securityCheckboxes">
                    ${DB.securityOptions.map(option => `
                        <label class="checkbox-label">
                            <input type="checkbox" name="security" value="${option}"
                                ${property && property.features && property.features.security && property.features.security.includes(option) ? 'checked' : ''}>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Legal & Contact Information</h3>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Ownership Status</label>
                    <select id="propOwnership" class="auth-input">
                        <option value="">Select</option>
                        <option value="Owner" ${property && property.legal && property.legal.ownership === 'Owner' ? 'selected' : ''}>Owner</option>
                        <option value="Agent" ${property && property.legal && property.legal.ownership === 'Agent' ? 'selected' : ''}>Agent</option>
                        <option value="Developer" ${property && property.legal && property.legal.ownership === 'Developer' ? 'selected' : ''}>Developer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Title Type</label>
                    <select id="propTitleType" class="auth-input">
                        <option value="">Select</option>
                        <option value="Deed" ${property && property.legal && property.legal.title === 'Deed' ? 'selected' : ''}>Deed</option>
                        <option value="Leasehold" ${property && property.legal && property.legal.title === 'Leasehold' ? 'selected' : ''}>Leasehold</option>
                        <option value="Cession" ${property && property.legal && property.legal.title === 'Cession' ? 'selected' : ''}>Cession</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Assign Agent *</label>
                <select id="propAgent" required class="auth-input">
                    <option value="">Select Agent</option>
                    ${agents.map(agent => `
                        <option value="${agent.id}" ${property && property.agentId === agent.id ? 'selected' : ''}>
                            ${agent.name} (${agent.role})
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Property Description</h3>
            <div class="form-group">
                <label>Detailed Description *</label>
                <textarea id="propDescription" rows="6" required class="auth-input">${property ? property.description : ''}</textarea>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Viewing Information</h3>
            <div class="multi-input-row">
                <div class="form-group">
                    <label>Viewing Availability</label>
                    <input type="text" id="propViewingAvailability" value="${property && property.viewing ? property.viewing.availability : ''}" placeholder="e.g., Weekdays 9am-5pm" class="auth-input">
                </div>
                <div class="form-group">
                    <label>Viewing Instructions</label>
                    <input type="text" id="propViewingInstructions" value="${property && property.viewing ? property.viewing.instructions : ''}" placeholder="e.g., 24-hour notice required" class="auth-input">
                </div>
            </div>
        </div>
        
        <div class="upload-section">
            <h3>Property Images</h3>
            <div class="form-group">
                <label>Image URLs (One per line)</label>
                <textarea id="propImages" rows="4" placeholder="Enter image URLs, one per line" class="auth-input">${property ? property.images.join('\n') : ''}</textarea>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    enterDashboard();
});