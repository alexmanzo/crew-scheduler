//Populate page with existing events
function getEvents() {
    const eventAjax = $.ajax({
        method: 'GET',
        url: '/api/events',
    })

    $.when(eventAjax).done(events => {
        for (index in events) {
            const eventId = events[index].id
            const date = events[index].date
            const time = events[index].time
            const call = events[index].call
            const sport = events[index].sport
            const opponent = events[index].opponent
            const location = events[index].location

            const crewAjax = $.ajax({
                method: 'GET',
                url: `api/crew/${eventId}`
            })

            $.when(crewAjax).done(crewResponse => {
                const sortedCrew = crewResponse[0].crew.sort((a, b) => { return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0) })
                const crewArray = Object.values(sortedCrew).map(pos => Object.values(pos).toString())
                const fullCrew = crewArray.toString() + ','
                const regex = /([^,]*),([^,]*),/gi
                const subst = `$1: $2<br>`
                const crew = fullCrew.replace(regex, subst)


                if (crewArray === null || crewArray.length == 0) {
                    $('.schedule').append(
                        `<br>
                    <div class="event" id="${eventId}">
                    <p class="event-details">Date: <span class="date event-details">${date}</span></p>
                    <p class="event-details">Game Time: <span class="time event-details">${time}</span></p>
                    <p class="event-details">Call Time: <span class="call event-details">${call}</span></p>                    
                    <p class="event-details">Event: <span class="sport event-details">${sport}</span> vs. <span class="opponent event-details">${opponent}</span></p>
                    <p class="event-details">Location: <span class="location event-details">${location}</span></p>
                    <button class="edit-event-button">Edit Event</button>
                    <button class="delete-event-button">Delete Event</button></div>`)
                } else {
                    $('.schedule').append(
                        `<br>
                    <div class="event" id="${eventId}">
                    <p class="event-details">Date: <span class="date event-details">${date}</span></p>
                    <p class="event-details">Game Time: <span class="time event-details">${time}</span></p>
                    <p class="event-details">Call Time: <span class="call event-details">${call}</span></p>                    
                    <p class="event-details">Event: <span class="sport event-details">${sport}</span> vs. <span class="opponent event-details">${opponent}</span></p>
                    <p class="event-details">Location: <span class="location event-details">${location}</span></p>
                    <p class="event-details">Crew:</p>${crew}
                    <br>
                    <button class="edit-event-button">Edit Event</button>
                    <button class="delete-event-button">Delete Event</button>
                    </div>`)
                }
            })
        }
    })


}


function watchSignOutClick() {
    $('#sign-out').click((e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('role')
        window.location.href = "/"
    })
}

function handleCrewDashboard() {
    getEvents()
    watchSignOutClick()
}

// Navigation Re-direct
$('#edit-availability').on('click', (e) => {
    e.preventDefault()
    window.location = 'availability.html'
})

handleCrewDashboard()