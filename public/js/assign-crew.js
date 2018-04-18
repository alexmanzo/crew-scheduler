
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
    for (index in events) { 
        $.ajax({
            method: 'GET',
            url: `/api/availability/${events[index].id}`,
            success: availabilityData => {
                let availability = availabilityData[0].availableCrew               
                const positions = events[index].positions
                let positionsToStaff = []
                let availableCrew = []
                for (j=0; j<availability.length; j++) {
                        availableCrew.push(`<option>${availability[j]}</option>`)
                }
                for (i=0; i<positions.length; i++) {
                    if (events[index].crew.length === 0) {
                        positionsToStaff.push(`
                        <label for="${positions[i]}" class=".label" id="${positions[i]}">${positions[i]}</label>
                            <select class="available-crew" name="${positions[i]}" id="${positions[i]}">
                                <option disabled selected>Choose Crew Member</option>
                                ${availableCrew.join()}
                            </select>  
                            <button type="submit" class="crew-assign-submit">Save</button>          
                        `)
                    } else if (events[index].crew[i].position === positions[i]) {
                        const crewIndex = availableCrew.indexOf(`<option>${events[index].crew[i].crewMember}</option>`)
                        availableCrew.splice(crewIndex, 1)
                        positionsToStaff.push(`
                        <label for="${events[index].crew[i].position}" class=".label" id="${events[index].crew[i].position}">${events[index].crew[i].position}</label>
                            <select class="available-crew" name="${events[index].crew[i].position}" id="${events[index].crew[i].position}">
                                <option selected>${events[index].crew[i].crewMember}</option>
                                ${availableCrew.join().sort()}
                            </select>  
                            <button type="submit" class="crew-assign-submit">Save</button>         
                        `)
                      }

                }    

                $('.schedule').append(
                        `<form class="event-form" id="${events[index].id}">
                            <p>${events[index].date} ${events[index].time} ${events[index].call} ${events[index].sport} vs. ${events[index].opponent} ${events[index].location}</p>
                            <p>Positions</p>
                            ${positionsToStaff.join("<br />")}
                        </form>`
                        )  

            }          
          
        }) 

    $.ajax({
        method: 'POST',
        url: '/api/crew',
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
    getEventsForForm(displayEventsForForm);
}


// Edit events to add crew.
function assignCrew() {
    $('.schedule').on('click', '.crew-assign-submit', (e) => {
        e.preventDefault()
        let crewId = null
        const eventId = $(e.currentTarget).closest('form').attr('id')
        const crewMember = $(e.currentTarget).prev().val()
        const crewPosition = $(e.currentTarget).prev().prev('label').text()
        $.ajax({
            method: 'GET',
            url: `/api/crew/${eventId}`,
            success: response => {
                crewId = response[0].id
                let crew = { id: crewId, eventId: eventId, crew: { position: crewPosition, crewMember: crewMember }}
                $.ajax({
                    method: 'PUT',
                    url: `/api/crew/${crewId}`,
                    data: JSON.stringify(crew),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: response => { $('.message').html('Success.') }
                })
            }
        })
          
    })
}


 
getAndDisplayEventsForForm()
assignCrew()


$('#dashboard').on('click', (e) => {
    e.preventDefault()
    window.location = 'admin-dashboard.html' 
})
