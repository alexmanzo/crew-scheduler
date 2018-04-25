// API Requests to populate form data
function getSportsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/sports',
        success: callback,
        error: error => console.log(error)
    })
}

function populateFormWithSports(data) {
    for (index in data) {
        $("#sport").append(
            `<option value="${data[index].sport}">${data[index].sport}</option>`
        )
    }
}

function getOpponentsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/opponents',
        success: callback,
        error: error => console.log('error: opponents cannot be displayed')
    })
}

function populateFormWithOpponents(data) {
    for (index in data) {
        $("#opponent").append(
            `<option value="${data[index].opponent}">${data[index].opponent}</option>`
        )
    }
}

function getPositionsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/positions',
        success: callback,
        error: error => console.log('error: positions cannot be displayed')
    })
}

function populateFormWithPositions(data) {
    for (index in data) {
        $("#positions").append(
            `<div class="positions-form checkbox">
                <input type="checkbox" id="${data[index].position}" value="${data[index].position}">
                <label for="${data[index].position}" class="checkbox-label">${data[index].position}</label>
            </div>`
        )
    }
}

function getLocationsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/locations',
        success: callback,
        error: error => console.log('error: locations cannot be displayed')
    })
}


function populateFormWithLocations(data) {
    for (index in data) {
        $("#location").append(
            `<option value="${data[index].location}">${data[index].location}</option>`
        )
    }
}


function populateAllForms() {
    getSportsForForm(populateFormWithSports)
    getOpponentsForForm(populateFormWithOpponents)
    getPositionsForForm(populateFormWithPositions)
    getLocationsForForm(populateFormWithLocations)
}


// Add new values to API

function getNewSport(callback) {
    $('.js-new-sport-button').on('click', e => {
        e.preventDefault()
        let newSport = $('.js-new-sport').val()
        $('#new-sport').val("")
        $.ajax({
            method: 'POST',
            url: '/api/sports',
            data: JSON.stringify({ sport: newSport }),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error => {
                $('.sport-message').html(`<p class="sport-message">Please enter a sport to add.</p>`)
            }
        })
    })
}

function addNewSportToForm(data) {
    $("#sport").append(
        `<option value="${data.sport}">${data.sport}</option>`
    )
}

function getNewOpponent(callback) {
    $('.js-new-opponent-button').on('click', e => {
        e.preventDefault()
        let newOpponent = $('.js-new-opponent').val()
        $('#new-opponent').val("")
        $.ajax({
            method: 'POST',
            url: '/api/opponents',
            data: JSON.stringify({ opponent: newOpponent }),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error => {
                $('.opponent-message').html(`<p class="opponent-message">Please enter an opponent to add.</p>`)
            }
        })
    })
}

function addNewOpponentToForm(data) {
    $("#opponent").append(
        `<option value="${data.opponent}">${data.opponent}</option>`
    )
}

function getNewLocation(callback) {
    $('.js-new-location-button').on('click', e => {
        e.preventDefault()
        let newLocation = $('.js-new-location').val()
        $('#new-location').val("")
        $.ajax({
            method: 'POST',
            url: '/api/locations',
            data: JSON.stringify({ location: newLocation }),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error => {
                $('.location-message').html(`<p class="location-message">Please enter a location to add.</p>`)
            }
        })
    })
}

function addNewLocationToForm(data) {
    $("#location").append(
        `<option value="${data.location}">${data.location}</option>`
    )
}

function getNewPosition(callback) {
    $('.js-new-position-button').on('click', e => {
        e.preventDefault()
        let newPosition = $('.js-new-position').val()
        $('#new-position').val("")
        $.ajax({
            method: 'POST',
            url: '/api/positions',
            data: JSON.stringify({ position: newPosition }),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error => {
                $('.position-message').html(`<p class="position-message">Please enter a position to add.</p>`)
            }
        })
    })
}

function addNewPositionToForm(data) {
    $("#positions").append(
        `<div>
                <input type ="checkbox" id="${data.position}" name="position" value="${data.position}">
                <label for="${data.position}">${data.position}</label>
            </div>`
    )
}

function addNewValuesToForm() {
    getNewSport(addNewSportToForm)
    getNewOpponent(addNewOpponentToForm)
    getNewLocation(addNewLocationToForm)
    getNewPosition(addNewPositionToForm)
}


// Handle Form Submit and Create Event

function handleFormSubmit(callback) {
    $('.js-new-event-form').on('submit', e => {
        e.preventDefault()
        let eventDate = $('#date').val()
        let eventTime = $('#time').val()
        let eventCall = $('#call').val()
        let eventSport = $('#sport').val()
        let eventOpponent = $('#opponent').val()
        let eventLocation = $('#location').val()
        let eventPositions = $("#positions input:checkbox:checked").map(function() {
            return $(this).val()
        }).get()

        $.ajax({
            method: 'POST',
            url: '/api/events',
            data: JSON.stringify({
                date: eventDate,
                time: eventTime,
                call: eventCall,
                sport: eventSport,
                opponent: eventOpponent,
                location: eventLocation,
                positions: eventPositions
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error => {
                $('.message').html(`<p class="message">Please fill out all fields</p>`)
            }
        })
    })
}

function displaySuccessMessage(data) {
    $('.message').html(`<p class="message">Your event was created successfully!</p>`)
    $('.js-new-event-form').trigger('reset')
}

function handleCreateEventsPage() {
    handleFormSubmit(displaySuccessMessage)
    populateAllForms()
    addNewValuesToForm()
}

handleCreateEventsPage()

//Redirect to go back to dashboard.
$('#dashboard').on('click', (e) => {
    e.preventDefault()
    window.location = 'admin-dashboard.html'
})