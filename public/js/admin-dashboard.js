const MOCK_EVENTS = {
	"events": [
		{
			date: '04/11/2018',
			time: '6:00PM',
			call: '5:00PM',
			sport: 'Baseball',
			opponent: 'East Carolina',
			location: 'Latham Park',
			positions: ['Director', 'Replay', 'Camera 1', 'Camera 2', 'Camera 3', 'Camera 4']
		},

		{
			date: '04/15/2018',
			time: '1:00PM',
			call: '12:00PM',
			sport: `Women's Lacrosse`,
			opponent: 'James Madison',
			location: 'Rudd Field',
			positions: ['Director', 'Technical Director', 'Play-by-Play', 'Color', 'Camera 1', 'Camera 2', 'Camera 3']
		},

		{
			date: '04/17/2018',
			time: '6:00PM',
			call: '5:00PM',
			sport: 'Baseball',
			opponent: 'Campbell',
			location: 'Latham Park',
			positions: ['Director', 'Replay', 'Camera 1', 'Camera 2', 'Camera 3']
		},

		{
			date: '04/21/2018',
			time: '1:00PM',
			call: '12:00PM',
			sport: 'Softball',
			opponent: 'Hofstra',
			location: 'Hunt Park',
			positions: ['Director', 'Technical Direcotr', 'Camera 1', 'Camera 2']
		}

	]
}

function getEvents(callback) {
    setTimeout(() => { callback(MOCK_EVENTS) }, 100)
}

function displayEvents(data) {
    for (index in data.events) {
       $('.schedule').append(
        `<div class="event">${data.events[index].date} ${data.events[index].time} ${data.events[index].call} ${data.events[index].sport} vs. ${data.events[index].opponent} ${data.events[index].location}</div>`
        )
    }
}

function getAndDisplayEvents() {
    getEvents(displayEvents);
}


$('#new-event').on('click', (e) => {
	e.preventDefault()
	window.location = 'create-events.html'
})


$('#assign-crew').on('click', (e) => {
	e.preventDefault()
	window.location = '/assign-crew.html'
})

$('#edit-availability').on('click', (e) => {
	e.preventDefault()
	window.location = 'availability.html'
})

$(getAndDisplayEvents())