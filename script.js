// ================= STATE & DATA =================
const defaultDB = {
    version: 3,
    users: [
        { 
            id: 1, 
            name: 'Victor & Beven', 
            email: 'owner@nextgen.com', 
            pass: 'admin123', 
            role: 'owner', 
            avatar: 'V&B', 
            bio: 'Founders',
            phone: '+263715708327',
            status: 'active',
            department: 'Management',
            commission: 0,
            joinDate: '2025-12-30',
            firstLogin: false,
            passwordChanged: true
        },
        { 
            id: 2, 
            name: 'Beven Mapira', 
            email: 'bevenmapir@gmail.com', 
            pass: 'admin123', 
            role: 'owner', 
            avatar: 'B', 
            bio: 'Founder',
            phone: '+263779383154',
            status: 'active',
            department: 'Management',
            commission: 0,
            joinDate: '2025-12-30',
            firstLogin: false,
            passwordChanged: true
        },
        { 
            id: 3, 
            name: 'Vincent Chimoto', 
            email: 'vincent@nextgen.com', 
            pass: 'agent123', 
            role: 'agent', 
            avatar: 'Vi', 
            bio: 'Lead Agent',
            phone: '+263714384521',
            status: 'active',
            department: 'Residential',
            commission: 3.0,
            joinDate: '2022-06-01',
            firstLogin: false,
            passwordChanged: true
        },
        { 
            id: 4, 
            name: 'Visitor', 
            email: 'visitor@gmail.com', 
            pass: '123456', 
            role: 'visitor', 
            avatar: 'U', 
            favorites: [],
            phone: '+263774567890',
            status: 'active',
            joinDate: '2024-01-01',
            firstLogin: false,
            passwordChanged: true
        }
    ],
    properties: [
        { 
            id: 101, 
            title: 'Golden Mile Mansion', 
            category: 'sale', 
            type: 'house',
            price: 850000, 
            beds: 5, 
            baths: 5, 
            area: 1200, 
            loc: 'Borrowdale Brooke',
            province: 'Harare',
            city: 'Harare',
            agentId: 1, 
            status: 'active',
            images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
            description: 'Luxurious mansion with premium finishes',
            features: {
                parking: 3,
                kitchen: 'Modern',
                furnished: true,
                power: ['ZESA', 'Solar'],
                water: ['Municipal', 'Borehole'],
                security: ['Wall', 'Electric Fence', 'Alarm']
            },
            legal: {
                ownership: 'Owner',
                title: 'Deed',
                status: 'Available'
            },
            viewing: {
                availability: 'Appointment Only',
                instructions: '24-hour notice required'
            },
            coordinates: {
                lat: -17.7858,
                lng: 31.0449
            },
            createdAt: '2024-01-15'
        },
        { 
            id: 102, 
            title: 'Luxury Penthouse', 
            category: 'rent', 
            type: 'apartment',
            price: 2500, 
            beds: 3, 
            baths: 3, 
            area: 400, 
            loc: 'Avondale',
            province: 'Harare',
            city: 'Harare',
            agentId: 3, 
            status: 'active',
            images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
            description: 'Modern penthouse with panoramic views',
            features: {
                parking: 2,
                kitchen: 'Open-plan',
                furnished: true,
                power: ['ZESA'],
                water: ['Municipal'],
                security: ['Security Guard', 'CCTV']
            },
            legal: {
                ownership: 'Agent',
                title: 'Leasehold',
                status: 'Available'
            },
            viewing: {
                availability: 'Anytime',
                instructions: 'Call ahead'
            },
            coordinates: {
                lat: -17.8216,
                lng: 31.0492
            },
            createdAt: '2024-02-01'
        },
        { 
            id: 103, 
            title: 'Student Hub', 
            category: 'student', 
            type: 'apartment',
            price: 300, 
            beds: 1, 
            baths: 1, 
            area: 30, 
            loc: 'Mt Pleasant',
            province: 'Harare',
            city: 'Harare',
            agentId: 2, 
            status: 'active',
            images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
            description: 'Affordable student accommodation near university',
            features: {
                parking: 0,
                kitchen: 'Shared',
                furnished: true,
                power: ['ZESA'],
                water: ['Municipal'],
                security: ['Security Guard']
            },
            legal: {
                ownership: 'Owner',
                title: 'Deed',
                status: 'Available'
            },
            viewing: {
                availability: 'Weekdays',
                instructions: 'Contact agent'
            },
            coordinates: {
                lat: -17.7764,
                lng: 31.0516
            },
            createdAt: '2024-01-20'
        },
        { 
            id: 104, 
            title: 'Highlands Estate', 
            category: 'sale', 
            type: 'house',
            price: 450000, 
            beds: 4, 
            baths: 3, 
            area: 2000, 
            loc: 'Highlands',
            province: 'Harare',
            city: 'Harare',
            agentId: 1, 
            status: 'sold',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
            description: 'Spacious family home in quiet neighborhood',
            features: {
                parking: 2,
                kitchen: 'Traditional',
                furnished: false,
                power: ['ZESA'],
                water: ['Borehole'],
                security: ['Wall', 'Gate']
            },
            legal: {
                ownership: 'Owner',
                title: 'Deed',
                status: 'Sold'
            },
            viewing: {
                availability: 'N/A',
                instructions: 'Property sold'
            },
            coordinates: {
                lat: -17.7981,
                lng: 31.0753
            },
            createdAt: '2023-11-15'
        },
        { 
            id: 105, 
            title: 'City Loft', 
            category: 'rent', 
            type: 'apartment',
            price: 1200, 
            beds: 2, 
            baths: 1, 
            area: 90, 
            loc: 'CBD',
            province: 'Harare',
            city: 'Harare',
            agentId: 3, 
            status: 'active',
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
            description: 'Modern loft apartment in city center',
            features: {
                parking: 1,
                kitchen: 'Modern',
                furnished: true,
                power: ['ZESA'],
                water: ['Municipal'],
                security: ['24/7 Security', 'CCTV']
            },
            legal: {
                ownership: 'Developer',
                title: 'Leasehold',
                status: 'Available'
            },
            viewing: {
                availability: 'Weekends',
                instructions: 'Appointment required'
            },
            coordinates: {
                lat: -17.8292,
                lng: 31.0522
            },
            createdAt: '2024-02-10'
        }
    ],
    pipeline: [
        { id: 1, title: 'Borrowdale Deal', stage: 'lead', value: '$850k', agent: 'Vincent Chimoto' },
        { id: 2, title: 'Avondale Rent', stage: 'negotiation', value: '$2.5k/m', agent: 'Beven Mapira' },
        { id: 3, title: 'Highlands Sale', stage: 'sold', value: '$450k', agent: 'Victor Makwarimba' }
    ],
    requests: [],
    cities: {
        'Harare': ['Harare CBD', 'Borrowdale', 'Avondale', 'Mt Pleasant', 'Highlands', 'Mabelreign', 'Milton Park'],
        'Bulawayo': ['Bulawayo CBD', 'Hillside', 'Suburbs', 'Morningside'],
        'Manicaland': ['Mutare', 'Nyanga', 'Chipinge'],
        'Mashonaland': ['Marondera', 'Bindura', 'Chinhoyi'],
        'Masvingo': ['Masvingo', 'Great Zimbabwe'],
        'Matabeleland': ['Victoria Falls', 'Hwange', 'Beitbridge'],
        'Midlands': ['Gweru', 'Kwekwe', 'Shurugwi']
    },
    propertyTypes: ['House', 'Apartment', 'Townhouse', 'Commercial', 'Land', 'Student Accommodation'],
    securityOptions: ['Wall', 'Electric Fence', 'Alarm', 'CCTV', 'Security Guard', 'Burglar Bars', 'Guard House'],
    powerOptions: ['ZESA', 'Solar', 'Generator', 'Inverter'],
    waterOptions: ['Municipal', 'Borehole', 'Tank', 'Well']
};

let DB = JSON.parse(localStorage.getItem('nextGenDB')) || defaultDB;
let currentUser = JSON.parse(sessionStorage.getItem('nextGenUser')) || null;
let compareList = JSON.parse(localStorage.getItem('nextGenCompare')) || [];

const saveDB = () => localStorage.setItem('nextGenDB', JSON.stringify(DB));
const saveSession = () => {
    if(currentUser) sessionStorage.setItem('nextGenUser', JSON.stringify(currentUser));
    else sessionStorage.removeItem('nextGenUser');
};
const saveCompare = () => localStorage.setItem('nextGenCompare', JSON.stringify(compareList));

// ================= THEME TOGGLE =================
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('nextGenTheme', newTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`, 'success');
}

function initTheme() {
    const savedTheme = localStorage.getItem('nextGenTheme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ================= TOAST NOTIFICATIONS =================
function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ================= MOBILE NAVIGATION =================
let isMobileMenuOpen = false;

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (!mobileNav) return;
    
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Close all mobile dropdowns
        document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (!mobileNav) return;
    
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
    isMobileMenuOpen = false;
    // Close all mobile dropdowns
    document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function toggleMobileDropdown(dropdownId) {
    const dropdown = document.getElementById(`mobile${dropdownId.charAt(0).toUpperCase() + dropdownId.slice(1)}Dropdown`);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// ================= AUTHENTICATION UI =================
function updateAuthUI() {
    const container = document.getElementById('auth-section');
    if (!container) return;
    
    if(currentUser) {
        container.innerHTML = `
            <div style="cursor: pointer; display: flex; align-items: center; gap: 10px;" onclick="window.location.href='dashboard.html'">
                <div style="width: 35px; height: 35px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold;">${currentUser.avatar}</div>
                <span style="font-size: 0.9rem; color: var(--light-text);">${currentUser.name}</span>
            </div>
        `;
    } else {
        container.innerHTML = `<a href="login.html" class="btn btn-accent btn-sm">Login</a>`;
    }
}

function updateMobileAuthUI() {
    const container = document.getElementById('mobile-auth-section');
    if (!container) return;
    
    if(currentUser) {
        container.innerHTML = `
            <div style="padding: 1rem 2rem; border-bottom: 1px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                    <div style="width: 40px; height: 40px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold;">${currentUser.avatar}</div>
                    <div>
                        <h4 style="margin: 0;">${currentUser.name}</h4>
                        <small style="color: var(--accent);">${currentUser.role.toUpperCase()}</small>
                    </div>
                </div>
                <a href="dashboard.html" class="btn btn-accent" style="width: 100%; margin-bottom: 0.5rem; text-decoration: none;">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <button onclick="logout(); closeMobileMenu();" class="btn btn-outline" style="width: 100%;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="padding: 1rem 2rem; border-bottom: 1px solid var(--border);">
                <a href="login.html" class="btn btn-accent" style="width: 100%; margin-bottom: 0.5rem; text-decoration: none;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="login.html" class="btn btn-outline" style="width: 100%; text-decoration: none;">
                    <i class="fas fa-user-plus"></i> Sign Up
                </a>
            </div>
        `;
    }
}

function logout() {
    currentUser = null;
    saveSession();
    updateAuthUI();
    updateMobileAuthUI();
    showToast('Logged out successfully', 'info');
    window.location.href = 'index.html';
}

// ================= PROPERTY CARD FUNCTIONS =================
function createCard(p) {
    const isSelected = compareList.includes(p.id);
    const categoryText = p.category === 'sale' ? 'For Sale' : 
                        p.category === 'rent' ? 'For Rent' : 
                        p.category.charAt(0).toUpperCase() + p.category.slice(1);
    
    return `
        <div class="card">
            <input type="checkbox" class="compare-checkbox" ${isSelected ? 'checked' : ''} onchange="toggleCompare(${p.id}, this)">
            <div class="card-img-container" onclick="window.location.href='property-detail.html?id=${p.id}'">
                <img src="${p.images[0]}" class="card-img">
                <span class="card-badge" style="background: var(--accent); color: #000;">${categoryText}</span>
                <div class="card-price">$${p.price.toLocaleString()}${p.category === 'rent' ? '/month' : ''}</div>
            </div>
            <div class="card-body" onclick="window.location.href='property-detail.html?id=${p.id}'">
                <h3 class="card-title">${p.title}</h3>
                <div class="card-location"><i class="fas fa-map-marker-alt text-gold"></i> ${p.loc}, ${p.city}</div>
                <div class="card-features">
                    <span><i class="fas fa-bed text-gold"></i> ${p.beds}</span>
                    <span><i class="fas fa-bath text-gold"></i> ${p.baths}</span>
                    <span><i class="fas fa-ruler-combined text-gold"></i> ${p.area}m²</span>
                </div>
            </div>
        </div>
    `;
}

// ================= COMPARISON FUNCTIONS =================
function toggleCompare(id, cb) {
    if(cb.checked) {
        if(compareList.length >= 3) {
            cb.checked = false;
            return showToast('Maximum 3 properties allowed for comparison', 'error');
        }
        compareList.push(id);
        showToast('Property added to comparison', 'success');
    } else {
        compareList = compareList.filter(pid => pid !== id);
        showToast('Property removed from comparison', 'info');
    }
    saveCompare();
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compareBar');
    if (!bar) return;
    
    const countElement = document.getElementById('compareCount');
    if (countElement) {
        countElement.innerText = `${compareList.length}/3`;
    }
    
    if(compareList.length > 0) bar.classList.add('active');
    else bar.classList.remove('active');
}

function clearCompare() {
    compareList = [];
    saveCompare();
    updateCompareBar();
    showToast('Comparison cleared', 'info');
    
    // Uncheck all compare checkboxes
    document.querySelectorAll('.compare-checkbox').forEach(cb => {
        cb.checked = false;
    });
}

// ================= MODAL MANAGEMENT =================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ================= INITIALIZATION =================
function initCommon() {
    initTheme();
    updateAuthUI();
    updateMobileAuthUI();
    updateCompareBar();
    
    // Check if user needs to change password on page load
    if (currentUser && currentUser.firstLogin === true) {
        setTimeout(() => {
            const changePassModal = document.getElementById('changePasswordModal');
            if (changePassModal) {
                changePassModal.classList.add('active');
            }
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
});