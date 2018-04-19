function getEvents() {
    const eventAjax = $.ajax({
        method: 'GET',
        url: '/api/events',
    })
    const crewAjax = $.ajax({
        method: 'GET',
        url: 'api/crew/'
    })



    $.when(eventAjax, crewAjax).done((eventsResponse, crewResponse) => {
        const events = eventsResponse[0]
        const crews = crewResponse[0]
        for (index in events) {
            let sortedCrew = null
            let crewArray = null
            let crew = null
            if (crews.length > 0) {
                sortedCrew = crews[index].crew.sort((a, b) => { return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0) }) 
                crewArray = Object.values(sortedCrew).map(pos => Object.values(pos).toString())
                const fullCrew = crewArray.toString() + ','
                const regex = /([^,]*),([^,]*),/gi
                const subst = `$1: $2<br>`
                crew = fullCrew.replace(regex, subst)
            }
            
            const eventPositions = events[index].positions
            if (crewArray === null || crewArray.length == 0) {
                $('.schedule').append(
                    `<br><div class="event" id="${events[index].id}"><span class="date">${events[index].date}</span> <span class="time">${events[index].time}</span> <span class="call">${events[index].call}</span> <span class="sport">${events[index].sport}</span> vs. <span class="opponent">${events[index].opponent}</span> <span class="location">${events[index].location}</span><button class="edit-event-button">Edit Event</button><button class="delete-event-button">Delete Event</button><br></div>`)
            } else {
                $('.schedule').append(
                    `<br><div class="event" id="${events[index].id}"><span class="date">${events[index].date}</span> <span class="time">${events[index].time}</span> <span class="call">${events[index].call}</span> <span class="sport">${events[index].sport}</span> vs. <span class="opponent">${events[index].opponent}</span> <span class="location">${events[index].location}</span><button class="edit-event-button">Edit Event</button><button class="delete-event-button">Delete Event</button><br><p>Crew:</p>${crew}<br><br></div>`)
            }
        }

    })


}
function getAndDisplayEvents() {
    getEvents(displayEvents);
}

function watchSignOutClick(){
  $('#sign-out').click((e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    window.location.href = "/"
  })
}


$('#edit-availability').on('click', (e) => {
	e.preventDefault()
	window.location = 'availability.html'
})

getEvents()
watchSignOutClick()