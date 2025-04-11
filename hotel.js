document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const searchForm = document.getElementById('searchForm');
    const hotelsList = document.getElementById('hotelsList');
    const hotelResults = document.getElementById('hotelResults');
    const bookingSection = document.getElementById('bookingSection');
    const guestForm = document.getElementById('guestForm');
    const confirmationSection = document.getElementById('confirmationSection');
    
    // Payment elements
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const backToHotelsBtn = document.getElementById('backToHotels');
    
    // Sample hotel data
    const sampleHotels = [
        {
            id: 1,
            name: 'Grand Plaza Hotel',
            location: 'New York, USA',
            image: 'images/The-Savoy-London.jpg',
            rating: 4.5,
            amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Fitness Center'],
            price: 27450,
            pricePer: '5 nights'
        },
        {
            id: 2,
            name: 'Seaside Resort',
            location: 'Miami, USA',
            image: 'images/Presidential-Suite1- Hotel-Raphael Paris-min.webp',
            rating: 4.8,
            amenities: ['Free WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Bar'],
            price: 17200,
            pricePer: '5 nights'
        },
        {
            id: 3,
            name: 'Mountain View Lodge',
            location: 'Denver, USA',
            image: 'images/CErulean Tower Hotel.jpg',
            rating: 4.2,
            amenities: ['Free WiFi', 'Mountain View', 'Restaurant', 'Free Parking'],
            price: 33000,
            pricePer: '5 nights'
        },
        {
        id: 4,
        name: 'The Ritz ',
        location: 'Dallas, USA',
        image: 'images/ritz-paris_deluxetargets_1500x1000.jpg',
        rating: 4.8,
        amenities: ['Spa', 'Pool', 'Fine Dining', 'Concierge', 'Fitness Center', '24/7 Room Service'],
        price: 40000,
        pricePer: '5 nights'
        },
        {
            id: 4,
            name: 'Park Hyatt',
            location: 'Las Vegas, USA',
            image: 'images/park_Hyatt_Tokyo.jpg',
            rating: 4.8,
            amenities: ['City Views', 'Spa', 'Fitness Center', 'Bar', 'Fine Dining', 'Concierge'],
            price: 29000,
            pricePer: '5 nights'
        },
    ];
    
    // Current booking data
    let currentBooking = {
        hotel: null,
        guest: null,
        payment: null,
        search: null
    };
    
    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Save search criteria
        currentBooking.search = {
            destination: document.getElementById('destination').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            guests: document.getElementById('guests').value,
            rooms: document.getElementById('rooms').value
        };
        
        // In a real app, this would be an API call
        displayHotels(sampleHotels);
    });
    
    // Display hotels
    function displayHotels(hotels) {
        hotelResults.innerHTML = '';
        
        hotels.forEach(hotel => {
            const hotelCard = document.createElement('div');
            hotelCard.className = 'hotel-card';
            
            // Generate star rating
            let starsHtml = '';
            const fullStars = Math.floor(hotel.rating);
            const hasHalfStar = hotel.rating % 1 >= 0.5;
            
            for (let i = 0; i < fullStars; i++) {
                starsHtml += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            }
            
            // Generate amenities
            let amenitiesHtml = '';
            hotel.amenities.forEach(amenity => {
                amenitiesHtml += `<span class="amenity">${amenity}</span>`;
            });
            
            hotelCard.innerHTML = `
                <div class="hotel-image">
                    <img src="${hotel.image}" alt="${hotel.name}">
                </div>
                <div class="hotel-info">
                    <h3 class="hotel-name">${hotel.name}</h3>
                    <div class="hotel-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${hotel.location}</span>
                    </div>
                    <div class="hotel-rating">
                        <div class="stars">
                            ${starsHtml}
                        </div>
                        <span>${hotel.rating}</span>
                    </div>
                    <div class="hotel-amenities">
                        ${amenitiesHtml}
                    </div>
                </div>
                <div class="hotel-price">
                    <div class="price">₹${hotel.price}</div>
                    <small>${hotel.pricePer}</small>
                    <button class="btn select-hotel" data-id="${hotel.id}">Book Now</button>
                </div>
            `;
            
            hotelResults.appendChild(hotelCard);
        });
        
        // Show hotels section
        searchForm.style.display = 'none';
        hotelsList.style.display = 'block';
        
        // Add event listeners to book buttons
        document.querySelectorAll('.select-hotel').forEach(button => {
            button.addEventListener('click', function() {
                const hotelId = parseInt(this.getAttribute('data-id'));
                const selectedHotel = sampleHotels.find(h => h.id === hotelId);
                currentBooking.hotel = selectedHotel;
                showBookingSection();
            });
        });
    }
    
    // Show booking section
    function showBookingSection() {
        hotelsList.style.display = 'none';
        bookingSection.style.display = 'block';
        
        // Set booking details
        document.getElementById('bookingHotelImage').src = currentBooking.hotel.image;
        document.getElementById('bookingHotelName').textContent = currentBooking.hotel.name;
        document.getElementById('bookingHotelLocation').textContent = currentBooking.hotel.location;
        
        const checkinDate = new Date(currentBooking.search.checkin);
        const checkoutDate = new Date(currentBooking.search.checkout);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        
        document.getElementById('bookingDates').textContent = 
            `${checkinDate.toLocaleDateString('en-US', options)} - ${checkoutDate.toLocaleDateString('en-US', options)}`;
        
        document.getElementById('bookingGuests').textContent = 
            `${currentBooking.search.guests} ${currentBooking.search.guests === '1' ? 'Guest' : 'Guests'}`;
        
        document.getElementById('bookingRooms').textContent = 
            `${currentBooking.search.rooms} ${currentBooking.search.rooms === '1' ? 'Room' : 'Rooms'}`;
        
        document.getElementById('bookingPrice').textContent = currentBooking.hotel.price;
        
        // Reset payment method selection
        paymentMethods[0].classList.add('active');
        paymentDetails[0].classList.add('active');
    }
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            paymentDetails.forEach(d => d.classList.remove('active'));
            
            // Add active class to selected method
            this.classList.add('active');
            const method = this.getAttribute('data-method');
            document.getElementById(`${method}Details`).classList.add('active');
        });
    });
    
    // Back to hotels button
    backToHotelsBtn.addEventListener('click', function() {
        bookingSection.style.display = 'none';
        hotelsList.style.display = 'block';
    });
    
    // Confirm booking
    confirmBookingBtn.addEventListener('click', function() {
        // Validate guest form
        if (!guestForm.checkValidity()) {
            guestForm.reportValidity();
            return;
        }
        
        // Validate terms checkbox
        if (!document.getElementById('terms').checked) {
            alert('Please agree to the terms and conditions');
            return;
        }
        
        currentBooking.guest = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            specialRequests: document.getElementById('specialRequests').value
        };
        
        currentBooking.payment = {
            method: document.querySelector('.payment-method.active').getAttribute('data-method')
        };
        
        // Generate random confirmation number
        const ref = 'LS' + Math.floor(10000000 + Math.random() * 90000000);
        
        // Set confirmation details
        document.getElementById('confirmationRef').textContent = ref;
        document.getElementById('confirmationHotel').textContent = currentBooking.hotel.name;
        document.getElementById('confirmationLocation').textContent = currentBooking.hotel.location;
        
        const checkinDate = new Date(currentBooking.search.checkin);
        const checkoutDate = new Date(currentBooking.search.checkout);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        
        document.getElementById('confirmationDates').textContent = 
            `${checkinDate.toLocaleDateString('en-US', options)} - ${checkoutDate.toLocaleDateString('en-US', options)}`;
        
        document.getElementById('confirmationGuest').textContent = 
            `${currentBooking.guest.firstName} ${currentBooking.guest.lastName}`;
        
        document.getElementById('confirmationPrice').textContent = 
            `₹${currentBooking.hotel.price}.00`;
        
        // Show confirmation
        bookingSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        initBookingHistory();
    });
    
    // New booking button
    document.getElementById('newBooking').addEventListener('click', function() {
        // Reset forms
        searchForm.reset();
        guestForm.reset();
        
        // Reset UI
        confirmationSection.style.display = 'none';
        searchForm.style.display = 'block';
        hotelsList.style.display = 'none';
        bookingSection.style.display = 'none';
        
        // Reset booking data
        currentBooking = {
            hotel: null,
            guest: null,
            payment: null,
            search: null
        };
    });
    
// Initialize booking history
function initBookingHistory() {
    const bookingsTable = document.getElementById('bookings-table').querySelector('tbody');
    const cancelModal = document.getElementById('cancel-modal');
    let bookingToCancel = null;

    // Filter bookings for current user
    const userBookings = bookings.filter(b => b.email === currentUser?.email);
    
    if (userBookings.length === 0) {
        bookingsTable.innerHTML = '<tr><td colspan="6">No bookings found</td></tr>';
        return;
    }
    
    // Populate table
    userBookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.currentBooking.hotel.location}</td>
            <td>${booking.currentBooking.hotel.name}</td>
            <td>${booking.checkinDate.toLocaleDateString()}</td>
            <td>${booking.checkoutDate.toLocaleDateString()}</td>
            <td>${booking.currentBooking.guests}</td>
            <td>${booking.currentBooking.payment}</td>
            <td>${booking.status}</td>
            <td><button class="cancel-booking-btn" data-index="${index}">Cancel</button></td>
        `;
        bookingsTable.appendChild(row);
    });
    
    // Add cancel button event listeners
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            bookingToCancel = parseInt(this.getAttribute('data-index'));
            cancelModal.classList.add('active');
        });
    });
    
    // Confirm cancel
    document.getElementById('confirm-cancel').addEventListener('click', function() {
        if (bookingToCancel !== null) {
            bookings.splice(bookingToCancel, 1);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            cancelModal.classList.remove('active');
            window.location.reload();
        }
    });
    
    // Don't cancel
    document.getElementById('dont-cancel').addEventListener('click', function() {
        cancelModal.classList.remove('active');
        bookingToCancel = null;
    });
}

});
