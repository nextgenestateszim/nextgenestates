// Authentication specific JavaScript
let isVisitorLogin = false;
let currentTab = 'visitor';

function switchAuthTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('visitorAuth').style.display = tab === 'visitor' ? 'block' : 'none';
    document.getElementById('staffAuth').style.display = tab === 'staff' ? 'block' : 'none';
}

function toggleVisitorMode() {
    isVisitorLogin = !isVisitorLogin;
    const visitorBtnText = document.getElementById('visitorBtnText');
    const visitorToggleText = document.getElementById('visitorToggleText');
    const visitorRegFields = document.getElementById('visitorRegFields');
    
    if(isVisitorLogin) {
        visitorBtnText.innerText = "Login";
        visitorToggleText.innerHTML = "Don't have an account? Sign Up";
        visitorRegFields.style.display = 'none';
    } else {
        visitorBtnText.innerText = "Sign Up";
        visitorToggleText.innerHTML = "Already have an account? Login";
        visitorRegFields.style.display = 'block';
    }
}

function handleVisitorAuth(e) {
    e.preventDefault();
    const email = document.getElementById('visitorEmail').value;
    const pass = document.getElementById('visitorPass').value;
    
    if(isVisitorLogin) {
        // Login
        const user = DB.users.find(u => u.email === email && u.pass === pass && u.role === 'visitor');
        if(user) {
            currentUser = user;
            saveSession();
            updateAuthUI();
            updateMobileAuthUI();
            closeModal('authModal');
            showToast(`Welcome back, ${user.name}`, 'success');
            
            // Check if first login
            if (user.firstLogin === true) {
                setTimeout(() => {
                    document.getElementById('changePasswordModal').classList.add('active');
                }, 1000);
            }
        } else {
            showToast('Invalid credentials or not a visitor account', 'error');
        }
    } else {
        // Register
        const name = document.getElementById('visitorName').value;
        const phone = document.getElementById('visitorPhone').value;
        
        if(!name) return showToast('Name is required', 'error');
        if(DB.users.find(u => u.email === email)) {
            return showToast('Email already registered', 'error');
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            pass: pass,
            role: 'visitor',
            avatar: name.charAt(0).toUpperCase(),
            phone: phone,
            status: 'active',
            favorites: [],
            joinDate: new Date().toISOString().split('T')[0],
            firstLogin: true,
            passwordChanged: false
        };
        DB.users.push(newUser);
        saveDB();
        currentUser = newUser;
        saveSession();
        updateAuthUI();
        updateMobileAuthUI();
        closeModal('authModal');
        showToast('Account created successfully!', 'success');
        
        // Prompt to change password on first login
        setTimeout(() => {
            document.getElementById('changePasswordModal').classList.add('active');
        }, 1000);
    }
}

function handleStaffAuth(e) {
    e.preventDefault();
    const email = document.getElementById('staffEmail').value;
    const pass = document.getElementById('staffPass').value;
    
    const user = DB.users.find(u => u.email === email && u.pass === pass && u.role !== 'visitor');
    if(user) {
        currentUser = user;
        saveSession();
        updateAuthUI();
        updateMobileAuthUI();
        closeModal('authModal');
        showToast(`Welcome back, ${user.name}`, 'success');
        
        // Check if first login
        if (user.firstLogin === true) {
            setTimeout(() => {
                document.getElementById('changePasswordModal').classList.add('active');
            }, 1000);
        }
        
        if(user.role !== 'visitor') {
            window.location.href = 'dashboard.html';
        }
    } else {
        showToast('Invalid staff credentials', 'error');
    }
}

function handleChangePassword(e) {
    e.preventDefault();
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmNewPass = document.getElementById('confirmNewPassword').value;
    
    if (!currentUser) {
        showToast('You must be logged in to change password', 'error');
        return;
    }
    
    // Verify current password
    if (currentUser.pass !== currentPass) {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    // Validate new password
    if (newPass.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }
    
    if (newPass !== confirmNewPass) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    // Update password in database
    const userIndex = DB.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        DB.users[userIndex].pass = newPass;
        DB.users[userIndex].firstLogin = false;
        DB.users[userIndex].passwordChanged = true;
        
        // Update current user in session
        currentUser.pass = newPass;
        currentUser.firstLogin = false;
        currentUser.passwordChanged = true;
        
        saveDB();
        saveSession();
        
        showToast('Password changed successfully!', 'success');
        closeModal('changePasswordModal');
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
    }
}

function openForgotPassword() {
    closeModal('authModal');
    document.getElementById('forgotPasswordModal').classList.add('active');
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const user = DB.users.find(u => u.email === email);
    
    if(user) {
        // In a real app, send email here
        showToast(`Password reset link sent to ${email}`, 'success');
        closeModal('forgotPasswordModal');
    } else {
        showToast('Email not found in our system', 'error');
    }
}

function openRequestAccessModal() {
    closeModal('authModal');
    document.getElementById('requestAccessModal').classList.add('active');
}

function handleRequestAccess(e) {
    e.preventDefault();
    const name = document.getElementById('requestName').value;
    const email = document.getElementById('requestEmail').value;
    const phone = document.getElementById('requestPhone').value;
    const role = document.getElementById('requestRole').value;
    const reason = document.getElementById('requestReason').value;
    
    const newRequest = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        desiredRole: role,
        reason: reason,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    DB.requests.push(newRequest);
    saveDB();
    
    showToast('Access request submitted successfully!', 'success');
    closeModal('requestAccessModal');
}

function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
    isVisitorLogin = false;
    currentTab = 'visitor';
    document.getElementById('visitorBtnText').innerText = "Sign Up";
    document.getElementById('visitorToggleText').innerHTML = "Already have an account? Login";
    document.getElementById('visitorRegFields').style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize auth functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
    
    // Check if user needs to change password on page load
    if (currentUser && currentUser.firstLogin === true) {
        setTimeout(() => {
            const changePassModal = document.getElementById('changePasswordModal');
            if (changePassModal) {
                changePassModal.classList.add('active');
            }
        }, 1000);
    }
});