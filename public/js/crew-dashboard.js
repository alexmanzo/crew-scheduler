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
                const sortedCrew = crews[index].crew.sort((a,b) => {return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0)} )
                const crewArray = Object.values(sortedCrew).map(pos => Object.values(pos).toString())
                const fullCrew = crewArray.toString() + ','
                const regex = /([^,]*),([^,]*),/gi
                const subst = `$1: $2<br>`
                const crew = fullCrew.replace(regex, subst)
                if (crewArray === undefined || crewArray.length == 0) {
                    $('.schedule').append(
                        `<br><div class="event">${events[index].date} ${events[index].time} ${events[index].call} ${events[index].sport} vs. ${events[index].opponent} ${events[index].location}<br></div>`)
                } else {
                    $('.schedule').append(
                        `<br><div class="event">${events[index].date} ${events[index].time} ${events[index].call} ${events[index].sport} vs. ${events[index].opponent} ${events[index].location}<p>Crew:</p>${crew}<br><br></div>`)
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