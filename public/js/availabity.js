
//Populate form with events
function getEventsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/events',
        success: callback,
        error: error => console.log('error: events cannot be displayed')
    })
}

function displayEventsForForm(data) {
    const username = localStorage.getItem('user')
    for (index in data) {
        if (data[index].availability.includes(username)) {
            $('.schedule').append(
            `<div class="event-container" id="${data[index].id}">
                <input type="checkbox" id="${data[index].id}" class="id event-availability" checked>
                <label for="${data[index].id}">${data[index].date} ${data[index].time} ${data[index].call} ${data[index].sport} vs. ${data[index].opponent} ${data[index].location}</label>
            </div>`
            )
        } else {
            $('.schedule').append(
                `<div class="event-container" id="${data[index].id}">
                    <input type="checkbox" id="${data[index].id}" class="id event-availability">
                    <label for="${data[index].id}">${data[index].date} ${data[index].time} ${data[index].call} ${data[index].sport} vs. ${data[index].opponent} ${data[index].location}</label>
                </div>`
                )
          }
    }
}


function getAndDisplayEventsForForm() {
    getEventsForForm(displayEventsForForm);
}


// Edit events to add user availability
function showUserAsAvailable() {
    const user = localStorage.getItem('user')
    $('.availability-submit').on('click', (e) => {
        e.preventDefault()
        $('.event-availability:checked').each((i, obj) => {
            let eventId = $('.event-availability:checked')[i].id
            if ($('.event-availability:checked')) {
               let update = { id: eventId, availability: user}
               $.ajax({
                    method: 'PUT',
                    url: `/api/events/${eventId}`,
                    data: JSON.stringify(update),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: response => { $('.message').html('Success.') }
                })
            }

        })
        $('.event-availability:not(:checked)').each((i, obj) => {
            let eventId = $('.event-availability:not(:checked)')[i].id
            if ($('.event-availability:not(:checked)')) {
                $.ajax({
                    method: 'PUT',
                    url: `/api/events/remove-user/${user}/${eventId}`,
                    success: response => $('.message').html('Success.')
                }) 
            }   
        })
    })
}
 
showUserAsAvailable()
getAndDisplayEventsForForm()

$('#dashboard').on('click', (e) => {
    e.preventDefault()
    window.location = 'admin-dashboard.html' || 'crew-dasboard.html'
})
