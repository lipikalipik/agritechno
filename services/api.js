const API_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` })
        };
    }

    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        return data;
    }

    async login(email, password) {
        try {
            console.log('Attempting login with:', { email });
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, password })
            });

            const data = await this.handleResponse(response);
            console.log('Login response:', data);

            this.setToken(data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            return data.user;
        } catch (error) {
            console.error('Login error:', error);
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your network.');
            }
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    }

    async signup(name, email, password) {
        try {
            console.log('Attempting signup with:', { name, email });
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ name, email, password })
            });

            const data = await this.handleResponse(response);
            console.log('Signup response:', data);

            this.setToken(data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            return data.user;
        } catch (error) {
            console.error('Signup error:', error);
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your network.');
            }
            if (error.message.includes('Email already exists')) {
                throw new Error('This email is already registered. Please try logging in.');
            }
            throw new Error(error.message || 'Signup failed. Please try again.');
        }
    }

    async updateProfile(profileData) {
        try {
            console.log('Updating profile:', profileData);
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(profileData)
            });

            const data = await this.handleResponse(response);
            console.log('Profile update response:', data);

            // Update stored user data
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your network.');
            }
            throw new Error(error.message || 'Profile update failed. Please try again.');
        }
    }

    logout() {
        this.clearToken();
        localStorage.removeItem('currentUser');
    }
}

const api = new ApiService();
export default api; 