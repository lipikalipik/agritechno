import api from './services/api.js';

// DOM Elements
const profileForm = document.getElementById('profile-form');
const photoUpload = document.getElementById('photo-upload');
const profilePhoto = document.getElementById('profile-photo');
const profilePhotoSection = document.querySelector('.profile-photo');
const navProfileImage = document.getElementById('nav-profile-image');
const navProfileName = document.getElementById('nav-profile-name');
const errorMessage = document.querySelector('.error-message');

// Show error message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
};

// Load user data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Set form values
        document.getElementById('fullName').value = currentUser.name || '';
        document.getElementById('email').value = currentUser.email || '';

        if (currentUser.profile) {
            document.getElementById('gender').value = currentUser.profile.gender || '';
            document.getElementById('age').value = currentUser.profile.age || '';
            document.getElementById('phone').value = currentUser.profile.phone || '';
            document.getElementById('description').value = currentUser.profile.description || '';
            document.getElementById('address').value = currentUser.profile.address || '';
            document.getElementById('city').value = currentUser.profile.city || '';
            document.getElementById('state').value = currentUser.profile.state || '';

            // Load profile photo
            if (currentUser.profile.photoUrl) {
                profilePhoto.src = currentUser.profile.photoUrl;
                navProfileImage.src = currentUser.profile.photoUrl;
            }
        }

        // Update navigation profile name
        navProfileName.textContent = currentUser.name;
    } catch (error) {
        showError('Error loading profile data');
    }
});

// Handle profile photo upload
profilePhotoSection.addEventListener('click', () => {
    photoUpload.click();
});

// Handle photo upload
photoUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const photoUrl = e.target.result;
                await api.updateProfile({ profile: { photoUrl } });

                profilePhoto.src = photoUrl;
                navProfileImage.src = photoUrl;
            } catch (error) {
                showError('Error uploading photo');
            }
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('fullName').value,
        profile: {
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            phone: document.getElementById('phone').value,
            description: document.getElementById('description').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value
        }
    };

    try {
        const updatedUser = await api.updateProfile(formData);
        navProfileName.textContent = updatedUser.name;
        showError('Profile updated successfully!');
    } catch (error) {
        showError('Error updating profile');
    }
});

// Handle logout
document.querySelector('.logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    api.logout();
    window.location.href = 'home.html';
});

// Profile dropdown toggle
const profileTrigger = document.querySelector('.profile-trigger');
const dropdownContent = document.querySelector('.dropdown-content');

if (profileTrigger) {
    profileTrigger.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileTrigger?.contains(e.target)) {
        dropdownContent.style.display = 'none';
    }
}); 