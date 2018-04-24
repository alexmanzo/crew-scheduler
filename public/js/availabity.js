// Populate page with existing events
function getEventsForForm() {
    const eventAjax = $.ajax({
        method: 'GET',
        url: '/api/events',
    })

    $.when(eventAjax).done(events => {
        const user = localStorage.getItem('user')

        for (index in events) {

            let crewAvailability = null

            //Store event data
            const eventId = events[index].id
            const date = events[index].date
            const time = events[index].time
            const call = events[index].call
            const sport = events[index].sport
            const opponent = events[index].opponent
            const location = events[index].location

            //Get availability for each speicific event
            const availabilityAjax = $.ajax({
                method: 'GET',
                url: `/api/availability/${eventId}`,
            })

            $.when(availabilityAjax).done(availability => {
                //Accounts for if no availability exists yet.
                if (availability[0] != undefined) {
                    crewAvailability = availability[0].availableCrew
                }

                //If users is already listed as available for an event, page will remember and automatically keep that event checked.
                if (crewAvailability != null && crewAvailability.includes(user)) {
                    $('.schedule').append(
                        `<div class="event-container event-checkbox">
                    <input type="checkbox" id="${eventId}" class="id event-availability" checked>
                    <label for="${eventId}"><p class="event-details">Date: <span class="date event-details">${date}</span></p>
                        <p class="event-details">Game Time: <span class="time event-details">${time}</span></p>
                        <p class="event-details">Call Time: <span class="call event-details">${call}</span></p>                    
                        <p class="event-details">Event: <span class="sport event-details">${sport}</span> vs. <span class="opponent event-details">${opponent}</span></p>
                        <p class="event-details">Location: <span class="location event-details">${location}</span></p>
                        <br>
                    </label>
                </div>`
                    )
                } else {
                    $('.schedule').append(
                        `<div class="event-container event-checkbox">
                    <input type="checkbox" id="${eventId}" class="id event-availability">
                    <label for="${eventId}"><p class="event-details">Date: <span class="date event-details">${date}</span></p>
                        <p class="event-details">Game Time: <span class="time event-details">${time}</span></p>
                        <p class="event-details">Call Time: <span class="call event-details">${call}</span></p>                    
                        <p class="event-details">Event: <span class="sport event-details">${sport}</span> vs. <span class="opponent event-details">${opponent}</span></p>
                        <p class="event-details">Location: <span class="location event-details">${location}</span></p>
                        <br>
                    </label>
                </div>`
                    )
                }

                $.ajax({
                    method: 'POST',
                    url: '/api/availability',
                    data: JSON.stringify({
                        'eventId': `${eventId}`,
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: response => $('.message').html(response),
                    error: error => $('.message').html(error)
                })
            })


        }
    })
}

// Add user availability to API

function showUserAsAvailable() {
    const user = localStorage.getItem('user')
    const username = localStorage.getItem('username')
    let availabilityId = null
    $('.availability-submit').on('click', (e) => {
        e.preventDefault()
        $('.event-availability:checked').each((i, obj) => {
            let eventId = $('.event-availability:checked')[i].id
            $.ajax({
                method: 'GET',
                url: `/api/availability/${eventId}`,
                success: response => {
                    availabilityId = response[0].id
                    if ($('.event-availability:checked')) {
                        let update = { id: availabilityId, availableCrew: user }
                        $.ajax({
                            method: 'PUT',
                            url: `/api/availability/${availabilityId}`,
                            data: JSON.stringify(update),
                            contentType: 'application/json',
                            dataType: 'json',
                            success: response => $('.message').html('Success.')
                        })
                    }
                }
            })
        })
        $('.event-availability:not(:checked)').each((i, obj) => {
            let eventId = $('.event-availability:not(:checked)')[i].id
            if ($('.event-availability:not(:checked)')) {
                $.ajax({
                    method: 'DELETE',
                    url: `/api/availability/${user}/${eventId}`,
                    success: response => $('.message').html('Success.')
                })
            }
        })
    })
}

function handleAvailabilityPage() {
    getEventsForForm()
    showUserAsAvailable()
}

//Redirect to return to dashboard
$('#dashboard').on('click', (e) => {
    e.preventDefault()
    const userRole = localStorage.getItem('role')
    if (userRole === 'An Event Scheduler') {
        window.location = 'admin-dashboard.html'
    } else {
        window.location = 'crew-dashboard.html'
    }
})


handleAvailabilityPage()