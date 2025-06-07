import api from './services/api.js';

// DOM Elements
const loginSection = document.querySelector('.login-section');
const signupSection = document.querySelector('.signup-section');
const forgotSection = document.querySelector('.forgot-section');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const errorMessage = document.querySelector('.error-message');
const loadingSpinner = document.querySelector('.loading-spinner');

// Form switching
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.remove('show');
    signupSection.classList.add('show');
    forgotSection.classList.remove('show');
    errorMessage.style.display = 'none';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('show');
    signupSection.classList.remove('show');
    forgotSection.classList.remove('show');
    errorMessage.style.display = 'none';
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.remove('show');
    signupSection.classList.remove('show');
    forgotSection.classList.add('show');
    errorMessage.style.display = 'none';
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('show');
    signupSection.classList.remove('show');
    forgotSection.classList.remove('show');
    errorMessage.style.display = 'none';
});

// Show loading spinner
const showLoading = () => {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
};

// Hide loading spinner
const hideLoading = () => {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
};

// Show error message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
};

// Validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
    return password.length >= 6;
};

// Form submission handling
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    try {
        showLoading();
        await api.login(email, password);
        window.location.href = 'home.html';
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm.querySelector('input[type="text"]').value.trim();
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!isValidPassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        showLoading();
        await api.signup(name, email, password);
        window.location.href = 'home.html';
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
});

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = forgotPasswordForm.querySelector('input[type="email"]').value.trim();

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // For demo purposes, just show an alert
    alert('Password reset link has been sent to your email');
    loginSection.classList.add('show');
    forgotSection.classList.remove('show');
});

// Google Sign In (Mock)
document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Google Sign In functionality would be implemented here');
    });
});

// Update home.js to handle the login state
const updateHomePageUI = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('nav-login-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileName = document.querySelector('.profile-name');

    if (currentUser) {
        loginBtn.style.display = 'none';
        profileDropdown.style.display = 'block';
        profileName.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'block';
        profileDropdown.style.display = 'none';
    }
};

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
    errorMessage.style.display = 'none';
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupSection.style.display = 'block';
    loginSection.style.display = 'none';
    errorMessage.style.display = 'none';
}); 