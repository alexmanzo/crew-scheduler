function getEvents(callback) {
    $.ajax({
    	method: 'GET',
    	url: '/api/events',
    	success: callback,
        error: error => console.log('error: events cannot be displayed')
    })
}

function displayEvents(data) {
    for (index in data) {
       $('.schedule').append(
        `<div class="event">${data[index].date} ${data[index].time} ${data[index].call} ${data[index].sport} vs. ${data[index].opponent} ${data[index].location}</div>`
        )
    }
}

function getAndDisplayEvents() {
    getEvents(displayEvents);
}


$('#edit-availability').on('click', (e) => {
	e.preventDefault()
	window.location = 'availability.html'
})

$(getAndDisplayEvents())