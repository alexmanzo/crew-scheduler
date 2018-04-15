
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
    for (index in data) {
        const positions = data[index].positions
        let positionsToStaff = []
        const availability = data[index].availability
        let availableCrew = []

        for (j=0; j<availability.length; j++) {
            availableCrew.push(`<option>${availability[j]}</option>`)
        }

        for (i=0; i<positions.length; i++) {
            positionsToStaff.push(`
                <label for="${positions[i]}" class=".label" id="${positions[i]}">${positions[i]}</label>
                    <select class="available-crew" name="${positions[i]}" id="${positions[i]}">
                        ${availableCrew.join()}
                    </select>  
                    <button type="submit" class="crew-assign-submit">Save</button>           
                `)
        }
        
        $('.schedule').append(
            `<form class="event-form" id="${data[index].id}">
                <p>${data[index].date} ${data[index].time} ${data[index].call} ${data[index].sport} vs. ${data[index].opponent} ${data[index].location}</p>
                <p>Positions</p>
                ${positionsToStaff.join("<br />")}
            </form>`
            )

        }
}


function getAndDisplayEventsForForm() {
    getEventsForForm(displayEventsForForm);
}


// Edit events to add crew.
function assignCrew() {
    $('.schedule').on('click', '.crew-assign-submit', (e) => {
        e.preventDefault()
        const crewArray = []
        const eventId = $(e.currentTarget).closest('form').attr('id')
        const crewMember = $(e.currentTarget).prev().val()
        const crewPosition = $(e.currentTarget).prev().prev('label').text()
        crewArray.push({position: crewPosition, crewMember: crewMember})
        let update = { id: eventId, crew: crewArray}
       $.ajax({
            method: 'PUT',
            url: `/api/events/crew/${eventId}`,
            data: JSON.stringify(update),
            contentType: 'application/json',
            dataType: 'json',
            success: response => { $('.message').html('Success.') }
        })       
    })
}
 
getAndDisplayEventsForForm()
assignCrew()


$('#dashboard').on('click', (e) => {
    e.preventDefault()
    window.location = 'admin-dashboard.html' || 'crew-dasboard.html'
})
