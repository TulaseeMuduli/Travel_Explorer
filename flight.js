document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const searchForm = document.getElementById('searchForm');
    const flightsList = document.getElementById('flightsList');
    const flightResults = document.getElementById('flightResults');
    const bookingSection = document.getElementById('bookingSection');
    const passengerForm = document.getElementById('passengerForm');
    const confirmationSection = document.getElementById('confirmationSection');
    
    // Payment elements
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    
    // Sample flight data
    const sampleFlights = [
        {
            id: 1,
            from: 'Delhi',
            to: 'USA',
            departure: '2023-06-15T08:30:00',
            arrival: '2023-06-15T20:45:00',
            duration: '7h 15m',
            airline: 'Delta Airlines',
            price: 8500,
            stops: 0
        },
        {
            id: 2,
            from: 'Delhi',
            to: 'USA',
            departure: '2023-06-15T12:15:00',
            arrival: '2023-06-15T23:30:00',
            duration: '6h 15m',
            airline: 'British Airways',
            price: 10920,
            stops: 0
        },
        {
            id: 3,
            from: 'Delhi',
            to: 'USA',
            departure: '2023-06-15T18:45:00',
            arrival: '2023-06-16T08:00:00',
            duration: '7h 15m',
            airline: 'Virgin Atlantic',
            price: 17800,
            stops: 1
        }
    ];
    
    // Current booking data
    let currentBooking = {
        flight: null,
        passenger: null,
        payment: null
    };
    
    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, this would be an API call
        displayFlights(sampleFlights);
    });

    // Display flights
    function displayFlights(flights) {
        flightResults.innerHTML = '';
        
        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            
            const departureTime = new Date(flight.departure);
            const arrivalTime = new Date(flight.arrival);
            
            flightCard.innerHTML = `
                <div class="flight-info">
                    <div class="flight-time">
                        <span>${departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <div class="line"></div>
                        <span>${arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div class="flight-route">
                        <span>${flight.from}</span>
                        <div class="dot"></div>
                        <div class="line"></div>
                        <div class="dot"></div>
                        <span>${flight.to}</span>
                    </div>
                    <div class="flight-airline">
                        <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="${flight.airline}">
                        <span>${flight.airline} • ${flight.duration} • ${flight.stops === 0 ? 'Non-stop' : flight.stops + ' stop(s)'}</span>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price">₹${flight.price}</div>
                    <button class="btn select-flight" data-id="${flight.id}">Select</button>
                </div>
            `;
            
            flightResults.appendChild(flightCard);
        });
        
        // Show flights section
        searchForm.style.display = 'none';
        flightsList.style.display = 'block';
        
        // Add event listeners to select buttons
        document.querySelectorAll('.select-flight').forEach(button => {
            button.addEventListener('click', function() {
                const flightId = parseInt(this.getAttribute('data-id'));
                const selectedFlight = sampleFlights.find(f => f.id === flightId);
                currentBooking.flight = selectedFlight;
                showBookingSection();
            });
        });
    }
    
    // Show booking section
    function showBookingSection() {
        flightsList.style.display = 'none';
        bookingSection.style.display = 'block';
        
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
            document.getElementById(`${method}Details).classList.add('active')`);
        });
    });
    
    // Confirm payment
    confirmPaymentBtn.addEventListener('click', function() {
        // Validate passenger form
        if (!passengerForm.checkValidity()) {
            passengerForm.reportValidity();
            return;
        }
        
        currentBooking.passenger = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            passport: document.getElementById('passport').value
        };
        
        currentBooking.payment = {
            method: document.querySelector('.payment-method.active').getAttribute('data-method')
        };
        
        // Generate random booking reference
        const ref = 'ST' + Math.floor(10000000 + Math.random() * 90000000);
        
        // Set confirmation details
        document.getElementById('confirmationRef').textContent = ref;
        document.getElementById('confirmationFlight').textContent = `
            ${currentBooking.flight.from} to ${currentBooking.flight.to};`
        
        const departureTime = new Date(currentBooking.flight.departure);
        document.getElementById('confirmationDeparture').textContent = `
            ${departureTime.toLocaleDateString()}, ${departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})};`
        
        document.getElementById('confirmationPassenger').textContent = `
            ${currentBooking.passenger.firstName} ${currentBooking.passenger.lastName};`
        
        document.getElementById('confirmationPrice').textContent = `
            ₹${currentBooking.flight.price};`
        
        // Show confirmation
        bookingSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        initBookingHistory();
    });
    
    // New booking button
    document.getElementById('newBooking').addEventListener('click', function() {
        // Reset forms
        searchForm.reset();
        passengerForm.reset();
        
        // Reset UI
        confirmationSection.style.display = 'none';
        searchForm.style.display = 'block';
        flightsList.style.display = 'none';
        bookingSection.style.display = 'none';
        
        // Reset booking data
        currentBooking = {
            flight: null,
            passenger: null,
            payment: null
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
            <td>${booking.from}</td>        
            <td>${booking.to}</td>
            <td>${new Date(booking.departure).toLocaleDateString()}</td>
            <td>${new Date(booking.arrival).toLocaleDateString()}</td>
            <td>${booking.duration}</td>
            <td>${booking.airline}</td>
            <td>${booking.passenger}</td>           
            <td>${booking.price}</td>            
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

