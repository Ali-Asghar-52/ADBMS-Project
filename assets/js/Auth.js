// auth.js - Shared authentication functionality

// Initialize users if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// DOM Elements
const authPopup = document.getElementById('authPopup');
const showAuthBtn = document.getElementById('showAuthBtn');
const closePopupBtn = document.getElementById('closePopup');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

// Check if user is logged in
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && showAuthBtn) {
    updateAuthButton(currentUser.username);
}

// Show popup automatically on first visit if not logged in
if (!localStorage.getItem('hasVisited') && !currentUser && showAuthBtn) {
    setTimeout(() => {
        showAuthPopup();
        localStorage.setItem('hasVisited', 'true');
    }, 3000);
}

// Setup event listeners
function setupAuthEventListeners() {
    if (showAuthBtn) {
        // Show auth popup or logout
        showAuthBtn.addEventListener('click', function() {
            if (currentUser) {
                // If user is logged in, show logout option
                if (confirm(`Do you want to logout of ${currentUser.username}?`)) {
                    logoutUser();
                }
            } else {
                showAuthPopup();
            }
        });
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hideAuthPopup);
    }

    // Switch between login and register tabs
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => switchAuthTab('login'));
        registerTab.addEventListener('click', () => switchAuthTab('register'));
    }

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthTab('register');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthTab('login');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegistration);
    }

    if (authPopup) {
        authPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                hideAuthPopup();
            }
        });
    }
}

// Show auth popup
function showAuthPopup() {
    if (authPopup) {
        authPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide auth popup
function hideAuthPopup() {
    if (authPopup) {
        authPopup.classList.remove('active');
        document.body.style.overflow = '';
        clearMessages();
    }
}

// Switch between login and register tabs
function switchAuthTab(tab) {
    if (tab === 'login') {
        if (loginTab) loginTab.classList.add('active');
        if (registerTab) registerTab.classList.remove('active');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    } else {
        if (registerTab) registerTab.classList.add('active');
        if (loginTab) loginTab.classList.remove('active');
        if (registerForm) registerForm.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
    }
    clearMessages();
}

// Update auth button when user is logged in
function updateAuthButton(username) {
    if (showAuthBtn) {
        showAuthBtn.innerHTML = `<i class="fas fa-user"></i> ${username}`;
        showAuthBtn.style.backgroundColor = '#2ecc71';
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    if (showAuthBtn) {
        showAuthBtn.textContent = 'Login / Register';
        showAuthBtn.style.backgroundColor = '';
        showAuthBtn.innerHTML = 'Login / Register';
    }
    alert('You have been logged out successfully');
}

// Validate email format
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Validate username format
function isValidUsername(username) {
    const re = /^[a-zA-Z0-9]{4,20}$/;
    return re.test(username);
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate
    if (!email || !password) {
        showError(loginMessage, 'Please fill all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(loginMessage, 'Please enter a valid email address');
        return;
    }
    
    // Check users
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
        // Success
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        updateAuthButton(user.username);
        showSuccess(loginMessage, 'Login successful! Redirecting...');
        
        setTimeout(() => {
            hideAuthPopup();
            // Here you would redirect to the user dashboard
            // window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showError(loginMessage, 'Invalid email or password');
    }
}

// Handle registration
function handleRegistration() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validate
    if (!username || !email || !password || !confirmPassword) {
        showError(registerMessage, 'Please fill all fields');
        return;
    }
    
    if (!isValidUsername(username)) {
        showError(registerMessage, 'Username must be 4-20 characters (letters/numbers only)');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(registerMessage, 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError(registerMessage, 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(registerMessage, 'Passwords do not match');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        showError(registerMessage, 'Username already exists');
        return;
    }
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showError(registerMessage, 'Email already registered');
        return;
    }
    
    // Create user
    const newUser = { 
        id: Date.now(),
        username, 
        email, 
        password,
        registeredAt: new Date().toISOString() 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    currentUser = newUser;
    updateAuthButton(newUser.username);
    
    // Success
    showSuccess(registerMessage, 'Registration successful! Welcome ' + username);
    
    setTimeout(() => {
        hideAuthPopup();
        // Here you would redirect to the user dashboard
        // window.location.href = 'dashboard.html';
    }, 1500);
}

// Helper functions
function clearMessages() {
    if (loginMessage) {
        loginMessage.textContent = '';
        loginMessage.className = 'message';
    }
    if (registerMessage) {
        registerMessage.textContent = '';
        registerMessage.className = 'message';
    }
}

function showError(element, text) {
    if (element) {
        element.textContent = text;
        element.className = 'message error';
    }
}

function showSuccess(element, text) {
    if (element) {
        element.textContent = text;
        element.className = 'message success';
    }
}

// Initialize auth functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAuthEventListeners();
});



// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Change icon between hamburger and close
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
});
