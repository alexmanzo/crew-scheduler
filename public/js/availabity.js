
//Populate form with events
function getEventsForForm(callback) {
    $.ajax({
        method: 'GET',
        url: '/api/events',
        success: callback,
        error: error => console.log('error: events cannot be displayed')
    })
}

function displayEventsForForm(events) {
    const user = localStorage.getItem('user')
    for (index in events) {
        if (events[index].availability.includes(user)) {
            $('.schedule').append(
            `<div class="event-container" id="${events[index].id}">
                <input type="checkbox" id="${events[index].id}" class="id event-availability" checked>
                <label for="${events[index].id}">${events[index].date} ${events[index].time} ${events[index].call} ${events[index].sport} vs. ${events[index].opponent} ${events[index].location}</label>
            </div>`
            )
        } else {
            $('.schedule').append(
                `<div class="event-container" id="${events[index].id}">
                    <input type="checkbox" id="${events[index].id}" class="id event-availability">
                    <label for="${events[index].id}">${events[index].date} ${events[index].time} ${events[index].call} ${events[index].sport} vs. ${events[index].opponent} ${events[index].location}</label>
                </div>`
                )
          }
    $.ajax({
        method: 'POST',
        url: '/api/availability',
        data: JSON.stringify({
            'eventId': `${events[index].id}`, 
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: response => $('.message').html(response),
        error: error => $('.message').html(error)
    })      

    }   
}


function getAndDisplayEventsForForm() {
    getEventsForForm(displayEventsForForm)
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
            console.log(eventId)
            $.ajax({
                method: 'GET',
                url: `/api/availability/${eventId}`,
                success: response => {
                availabilityId = response[0].id
                  if ($('.event-availability:checked')) {
                       let update = { id: availabilityId, availableCrew: user}
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

getAndDisplayEventsForForm()
showUserAsAvailable()


$('#dashboard').on('click', (e) => {
    e.preventDefault()
    const userRole = localStorage.getItem('role')
    if (userRole === 'An Event Scheduler') {
        window.location = 'admin-dashboard.html'
    } else {
      window.location = 'crew-dashboard.html'
    }
})
