// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navUl = document.querySelector('nav ul');
const currentYear = document.getElementById('currentYear');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const carSaleForm = document.getElementById('carSaleForm');
const filterForm = document.getElementById('filterForm');
const resetFiltersBtn = document.getElementById('resetFilters');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');
const imagePreview = document.getElementById('imagePreview');

// Sample car data (in a real app, this would come from a database)
let cars = [
    {
        id: 1,
        car_name: "Toyota Camry",
        brand: "Toyota",
        model: "Camry",
        year: 2020,
        condition: "Used",
        mileage: 25000,
        price: 22000,
        image_path: "https://via.placeholder.com/300x200?text=Toyota+Camry",
        contact_info: "john@example.com",
        description: "Excellent condition, one owner, no accidents."
    },
    {
        id: 2,
        car_name: "Honda Civic",
        brand: "Honda",
        model: "Civic",
        year: 2019,
        condition: "Used",
        mileage: 30000,
        price: 19000,
        image_path: "https://via.placeholder.com/300x200?text=Honda+Civic",
        contact_info: "jane@example.com",
        description: "Well-maintained, great fuel economy."
    },
    {
        id: 3,
        car_name: "Ford Mustang",
        brand: "Ford",
        model: "Mustang",
        year: 2021,
        condition: "New",
        mileage: 500,
        price: 35000,
        image_path: "https://via.placeholder.com/300x200?text=Ford+Mustang",
        contact_info: "mike@example.com",
        description: "Brand new, GT model, premium package."
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Load cars on appropriate pages
    if (document.getElementById('recentCars')) {
        displayRecentCars();
    }
    
    if (document.getElementById('carList')) {
        displayAllCars();
    }
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navUl.classList.toggle('show');
        });
    }
    
    // Image preview
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                    previewImage.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // In a real app, you would send this to your backend
            console.log("Login attempt:", { username, password });
            
            // Simulate successful login
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Show success message
            const messageDiv = document.getElementById('loginMessage');
            messageDiv.textContent = "Login successful! Redirecting...";
            messageDiv.className = "message success";
            
            // Redirect to homepage after 1 second
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        });
    }
    
    // Registration form
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                const messageDiv = document.getElementById('registerMessage');
                messageDiv.textContent = "Passwords do not match!";
                messageDiv.className = "message error";
                return;
            }
            
            // In a real app, you would send this to your backend
            console.log("Registration attempt:", { username, email, password });
            
            // Simulate successful registration
            localStorage.setItem('registered', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            
            // Show success message
            const messageDiv = document.getElementById('registerMessage');
            messageDiv.textContent = "Registration successful! You can now login.";
            messageDiv.className = "message success";
            
            // Clear form
            registerForm.reset();
        });
    }
    
    // Car sale form
    if (carSaleForm) {
        carSaleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                car_name: document.getElementById('car_name').value,
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                condition: document.getElementById('condition').value,
                mileage: document.getElementById('mileage').value,
                price: document.getElementById('price').value,
                contact_info: document.getElementById('contact_info').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').files[0]
            };
            
            // In a real app, you would send this to your backend
            console.log("Car sale submission:", formData);
            
            // Generate a preview image URL (in a real app, this would be uploaded to a server)
            const imageUrl = formData.image ? URL.createObjectURL(formData.image) : "https://via.placeholder.com/300x200?text=Car+Image";
            
            // Add the new car to our array (in a real app, this would come from the server response)
            const newCar = {
                id: cars.length + 1,
                car_name: formData.car_name,
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                condition: formData.condition,
                mileage: formData.mileage,
                price: formData.price,
                image_path: imageUrl,
                contact_info: formData.contact_info,
                description: formData.description
            };
            
            cars.unshift(newCar); // Add to beginning of array
            
            // Show success message
            const messageDiv = document.getElementById('saleMessage');
            messageDiv.textContent = "Your car has been listed successfully!";
            messageDiv.className = "message success";
            
            // Clear form
            carSaleForm.reset();
            previewImage.classList.add('hidden');
            
            // Update the car listings
            if (document.getElementById('recentCars')) {
                displayRecentCars();
            }
            
            if (document.getElementById('carList')) {
                displayAllCars();
            }
        });
    }
    
    // Filter form
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(filterForm);
            const filters = Object.fromEntries(formData.entries());
            applyFilters(filters);
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            displayAllCars();
        });
    }
}

function displayRecentCars() {
    const recentCarsContainer = document.getElementById('recentCars');
    if (!recentCarsContainer) return;
    
    // Get the 3 most recent cars
    const recentCars = [...cars].slice(0, 3);
    
    recentCarsContainer.innerHTML = recentCars.map(car => createCarCard(car)).join('');
}

function displayAllCars() {
    const carListContainer = document.getElementById('carList');
    if (!carListContainer) return;
    
    carListContainer.innerHTML = cars.map(car => createCarCard(car)).join('');
}

function applyFilters(filters) {
    const carListContainer = document.getElementById('carList');
    if (!carListContainer) return;
    
    let filteredCars = [...cars];
    
    // Apply brand filter
    if (filters.brand) {
        filteredCars = filteredCars.filter(car => 
            car.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
    }
    
    // Apply model filter
    if (filters.model) {
        filteredCars = filteredCars.filter(car => 
            car.model.toLowerCase().includes(filters.model.toLowerCase())
        );
    }
    
    // Apply min price filter
    if (filters.min_price) {
        filteredCars = filteredCars.filter(car => 
            car.price >= parseFloat(filters.min_price)
        );
    }
    
    // Apply max price filter
    if (filters.max_price) {
        filteredCars = filteredCars.filter(car => 
            car.price <= parseFloat(filters.max_price)
        );
    }
    
    carListContainer.innerHTML = filteredCars.map(car => createCarCard(car)).join('');
}

function createCarCard(car) {
    return `
        <div class="car-card">
            <div class="car-image">
                <img src="${car.image_path}" alt="${car.car_name}">
            </div>
            <div class="car-details">
                <h3 class="car-title">${car.car_name}</h3>
                <div class="car-meta">
                    <span>${car.year} ${car.brand}</span>
                    <span>${car.mileage} miles</span>
                </div>
                <div class="car-price">$${car.price.toLocaleString()}</div>
                <p class="car-description">${car.description}</p>
                <div class="car-contact">Contact: ${car.contact_info}</div>
            </div>
        </div>
    `;
}