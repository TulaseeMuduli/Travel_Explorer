// Global variables
let currentUser = null;
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthUI();
    }

    // Initialize page-specific functionality
    if (document.querySelector('.activity-buttons')) {
        initActivityButtons();
    }

    if (document.querySelector('.places-grid')) {
        initPlaceCards();
    }

    if (document.getElementById('bookingForm')) {
        initBookingForm();
    }

    if (document.getElementById('loginForm')) {
        initLoginForm();
    }

    if (document.getElementById('registerForm')) {
        initRegisterForm();
    }

    // if (document.getElementById('bookings-table')) {
    //     initBookingHistory();
    // }

    if (document.getElementById('feedbackForm')) {
        initFeedbackForm();
    }

    // Initialize tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // History button
    const historyButtons = document.querySelectorAll('#history-btn');
    historyButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentUser) {
                window.location.href = 'history.html';
            } else {
                alert('Please login to view your booking history');
                window.location.href = 'login.html';
            }
        });
    });

    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
});

// Initialize activity buttons
function initActivityButtons() {
    const activityButtons = document.querySelectorAll('.activity-btn');
    const activityInfo = document.getElementById('activity-info');

    activityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activity = this.getAttribute('data-activity');
            fetchActivityInfo(activity);
        });
    });

    async function fetchActivityInfo(activity) {
        try {
            // In a real app, you would fetch from Wikipedia API
            // For this example, we'll use mock data
            const activities = {
                'hiking': 'Hiking is a long, vigorous walk, usually on trails or footpaths in the countryside. It is a popular activity with numerous hiking organizations worldwide.',
                'trekking': 'Trekking is a form of walking, undertaken with the specific purpose of exploring and enjoying the scenery. It usually takes place on trails in areas of relatively unspoiled wilderness.',
                'off-road': 'Off-roading is the activity of driving or riding a vehicle on unsurfaced roads or tracks, made of materials such as sand, gravel, riverbeds, mud, snow, rocks, and other natural terrain.',
                'bike-ride': 'Bike riding refers to riding bicycles for recreation, sport, or transportation. It can range from leisurely rides to competitive racing.',
                'car-race': 'Car racing is a motorsport involving the racing of automobiles for competition. There are numerous different categories of auto racing, each with different rules and regulations.'
            };

            activityInfo.innerHTML = `
                <h3>${activity.charAt(0).toUpperCase() + activity.slice(1).replace('-', ' ')}</h3>
                <p>${activities[activity]}</p>
                <p>Learn more on <a href="https://en.wikipedia.org/wiki/${activity}" target="_blank">Wikipedia</a></p>
            `;
        } catch (error) {
            activityInfo.innerHTML = '<p>Failed to load activity information. Please try again later.</p>';
            console.error('Error fetching activity info:', error);
        }
    }
}

// Initialize place cards
function initPlaceCards() {
    const placeCards = document.querySelectorAll('.place-card');
    const placeModal = document.getElementById('place-modal');
    const modalPlaceName = document.getElementById('modal-place-name');
    const modalPlaceImage = document.getElementById('modal-place-image');
    const modalPlaceDescription = document.getElementById('modal-place-description');
    const modalPlacePrice = document.getElementById('modal-place-price');
    const modalBookBtn = document.getElementById('modal-book-btn');

    const placeDetails = {
        'paris': {
            name: 'Paris, France',
            description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
            price: 'From ₹49999 per person'
        },
        'tokyo': {
            name: 'Tokyo, Japan',
            description: 'Tokyo, Japan\'s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.',
            price: 'From ₹451299 per person'
        },
        'new-york': {
            name: 'New York, USA',
            description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that\'s among the world\'s major commercial, financial and cultural centers.',
            price: 'From ₹79999 per person'
        },
        'sydney': {
            name: 'Sydney, Australia',
            description: 'Sydney, capital of New South Wales and one of Australia\'s largest cities, is best known for its harbourfront Sydney Opera House, with a distinctive sail-like design.',
            price: 'From ₹259000 per person'
        },
        'delhi': {
            name: 'Delhi, India',
            description: 'Delhi is a big city in India where many people live. It is the capital city, which means it is very important. Delhi has many old buildings like the Red Fort and Qutub Minar that people visit to learn about history. It also has modern buildings and big roads.',
            price: 'From ₹291092 per person'
        },
        'dubai': {
            name: 'Dubai, UAE',
            description: 'Dubai, nestled on the southeastern coast of the Arabian Peninsula, is a dazzling metropolis and a global hub for innovation, luxury, and cultural fusion. Part of the United Arab Emirates (UAE), Dubai is renowned for its stunning skyline dominated by architectural marvels like the Burj Khalifa, the tallest building in the world. It seamlessly blends tradition with modernity, offering visitors a rich tapestry of experiences, from exploring historic souks and the Dubai Creek to indulging in world-class shopping and entertainment. ',
            price: 'From ₹90000 per person'
        },
        'male': {
            name: 'Male, Maldives',
            description: 'Though Male is a city of the hustle and bustle, it has become one of the most favorite destinations for a wedding, honeymoon or getaway. Surrounded by the Indian Ocean, this small city offers a breathtaking view that captures every place in the visitor’s heart.',
            price: 'From ₹80500 per person'
        },
        'jakarta': {
            name: 'Jakarta, Indonesia',
            description: 'Jakarta is famous for iconic landmarks like the Istiqlal Mosque and Monas, a rich colonial past that left the charming Old Town and several heritage buildings, and Betawi dishes. It is also known as a hub for art, fashion, and commerce, as well as a melting pot of cultures and traditions.',
            price: 'From ₹149900 per person'
        }
    };

    placeCards.forEach(card => {
        const visitBtn = card.querySelector('.visit-btn');
        const priceBtn = card.querySelector('.price-btn');
        const place = card.getAttribute('data-place');

        visitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('Please login to view place details');
                window.location.href = 'login.html';
                return;
            }
            showPlaceDetails(place);
        });

        priceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'booking.html';
        });
    });

    modalBookBtn.addEventListener('click', function() {
        window.location.href = 'booking.html';
    });

    function showPlaceDetails(place) {
        const details = placeDetails[place];
        modalPlaceName.textContent = details.name;
        modalPlaceDescription.textContent = details.description;
        modalPlacePrice.textContent = details.price;
        placeModal.classList.add('active');
    }

    // Close modal when clicking outside content
    placeModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}


// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.email.value;
        const password = this.password.value;
        
        // In a real app, you would validate credentials with a server
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            
            // Redirect to home or previous page
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.href = redirect || 'index.html';
        } else {
            alert('Invalid email or password');
        }
    });
}

// Initialize register form
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.name.value;
        const email = this.email.value;
        const password = this.password.value;
        const confirm = this.confirm.value;
        
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        users.push({
            name,
            email,
            password
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login the new user
        currentUser = { name, email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        
        alert('Registration successful! You are now logged in.');
        window.location.href = 'index.html';
    });
}


// Initialize feedback form
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you would send this to a server
        alert('Thank you for your feedback!');
        this.reset();
    });
}

// Switch between tabs
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.auth-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === tabId) {
            tab.classList.add('active');
        }
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        }
    });
}

// Update UI based on auth status
function updateAuthUI() {
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    
    if (currentUser) {
        loginLinks.forEach(link => {
            link.textContent = 'Logout';
            link.href = '#';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                currentUser = null;
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        });
    } else {
        loginLinks.forEach(link => {
            link.textContent = 'Login';
            link.href = 'login.html';
        });
    }
}