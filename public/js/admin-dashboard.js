//Populate page with existing events
function getEvents() {
    const eventAjax = $.ajax({
        method: 'GET',
        url: '/api/events',
    })

    $.when(eventAjax).done(events => {
        for (index in events) {

            //Store event data
            const eventId = events[index].id
            const date = events[index].date
            const time = events[index].time
            const call = events[index].call
            const sport = events[index].sport
            const opponent = events[index].opponent
            const location = events[index].location

            //Request crew for each specific event
            const crewAjax = $.ajax({
                method: 'GET',
                url: `api/crew/${eventId}`
            })

            $.when(crewAjax).done(crewResponse => {
                // Formatting for crew on each event, and ensures crew is always listed in same order every time.
                let sortedCrew;
                let crewArray = []
                if (crewResponse[0] != undefined) {
                    sortedCrew = crewResponse[0].crew.sort((a, b) => { return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0) })
                    crewArray = Object.values(sortedCrew).map(pos => Object.values(pos).toString())
                }                
                const fullCrew = crewArray.toString() + ','
                const regex = /([^,]*),([^,]*),/gi
                const subst = `$1: $2<br>`
                const crew = fullCrew.replace(regex, subst)

                //If there is no crew assigned for an event yet, it will list event without crew.
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

// Navigation re-directs
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

// Delete Events
function deleteEvent() {
    $('.schedule').on('click', '.delete-event-button', (e) => {
        e.preventDefault()
        const id = $(e.currentTarget).parent('div').attr('id')
        console.log(id)
        $.ajax({
            method: 'DELETE',
            url: `/api/events/${id}`,
            success: response => {
                $('.message').html(`<p>Deleted successfully.</p>`)
                $(e.currentTarget).parent('div').remove()
            },
            error: error => {
                $('.message').html(`<p>Please fill out all fields</p>`)
            }
        })
    })
}

// Edit Events
function editEvent() {
    $('.schedule').on('click', '.edit-event-button', (e) => {
        e.preventDefault()
        // In order to populate the form with existing values, dates and times need to be re-formatted to be recognized.
        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        function formatEventTime(currentTime) {
            if ($(e.currentTarget).siblings('.event-details').children('.time').text().includes('PM')) {
                let hour = parseInt(currentTime[0])
                hour += 12
                currentTime.splice(0, 1, hour.toString())
                return currentTime.join(':')
            } else {
                return currentTime.join(':')
            }
        }

        function formatCallTime(currentCall) {
            if ($(e.currentTarget).siblings('.event-details').children('.call').text().includes('PM')) {
                let hour = parseInt(currentCall[0])
                hour += 12
                currentCall.splice(0, 1, hour.toString())
                return currentCall.join(':')
            } else {
                return currentCall.join(':')
            }
        }

        let id = $(e.currentTarget).parent('div').attr('id')
        let currentDate = formatDate($(e.currentTarget).siblings('.event-details').children('.date').text())
        let currentTime = $(e.currentTarget).siblings('.event-details').children('.time').text().slice(0, 5).split(':')
        let timeForForm = formatEventTime(currentTime)
        let currentCall = $(e.currentTarget).siblings('.event-details').children('.call').text().slice(0, 5).split(':')
        let callForForm = formatCallTime(currentCall)
        let currentSport = $(e.currentTarget).siblings('.event-details').children('.sport').text()
        let currentOpponent = $(e.currentTarget).siblings('.event-details').children('.opponent').text()
        let currentLocation = $(e.currentTarget).siblings('.event-details').children('.location').text()

        // Populates edit-event form with existing event values.
        $(e.currentTarget).parent('div').append(`
            <br>
            <div class="event-edit" id="${id}">
                <form class="edit-event-form">
                    <fieldset>
                        <label for="date">Date</label>
                        <input id="date" name="date" type="date" value="${currentDate}">
                    </fieldset>
                    <fieldset>
                        <label for="time">Time</label>
                        <input id="time" name="time" type="time" value="${timeForForm}">
                    </fieldset>
                    <fieldset>
                        <label for="call">Call</label>
                        <input id="call" name="call" type="time" value="${callForForm}">
                    </fieldset>
                    <fieldset>
                        <label for="sport">Sport</label>
                        <select name="sport" id="sport">
                            <option selected >${currentSport}</option>
                        </select>
                    </fieldset>
                    <fieldset>
                        <label for="opponent">Opponent</label>
                        <select name="opponent" id="opponent">
                            <option selected>${currentOpponent}</option>
                        </select>
                    </fieldset>
                    <fieldset>
                        <label for="location">Location</label>
                        <select name="location" id="location">
                            <option selected>${currentLocation}</option>
                        </select>
                    </fieldset>  
                    <button type="submit" class="update-event-submit">Update</button>
                    <button type="submit" class="cancel-update-button">Cancel</button>
                    </form>`)

        //Populate edit event form with category data on sports, locations, opponents, etc.
        populateAllForms()

    })

    // API Requests to populate form data
    function getSportsForForm(callback) {
        $.ajax({
            method: 'GET',
            url: '/api/sports',
            success: callback,
            error: error => console.log(error)
        })
    }

    function populateFormWithSports(data) {
        for (index in data) {
            $("#sport").append(
                `<option value="${data[index].sport}">${data[index].sport}</option>`
            )
        }
    }

    function getOpponentsForForm(callback) {
        $.ajax({
            method: 'GET',
            url: '/api/opponents',
            success: callback,
            error: error => console.log('error: opponents cannot be displayed')
        })
    }

    function populateFormWithOpponents(data) {
        for (index in data) {
            $("#opponent").append(
                `<option value="${data[index].opponent}">${data[index].opponent}</option>`
            )
        }
    }

    function getPositionsForForm(callback) {
        $.ajax({
            method: 'GET',
            url: '/api/positions',
            success: callback,
            error: error => console.log('error: positions cannot be displayed')
        })
    }

    function populateFormWithPositions(data) {
        for (index in data) {
            $("#positions").append(
                `<div>
                <input type ="checkbox" id="${data[index].position}" name="position" value="${data[index].position}">
                <label for="${data[index].position}">${data[index].position}</label>
            </div>`
            )
        }
    }

    function getLocationsForForm(callback) {
        $.ajax({
            method: 'GET',
            url: '/api/locations',
            success: callback,
            error: error => console.log('error: locations cannot be displayed')
        })
    }


    function populateFormWithLocations(data) {
        for (index in data) {
            $("#location").append(
                `<option value="${data[index].location}">${data[index].location}</option>`
            )
        }
    }


    function populateAllForms() {
        getSportsForForm(populateFormWithSports)
        getOpponentsForForm(populateFormWithOpponents)
        getPositionsForForm(populateFormWithPositions)
        getLocationsForForm(populateFormWithLocations)
    }

}

function handleEditEventSubmit() {
    $('.schedule').on('click', '.update-event-submit', (e) => {
        e.preventDefault()
        const eventId = $(e.currentTarget).closest('div').attr('id')
        let eventDate = $('#date').val()
        let eventTime = $('#time').val()
        let eventCall = $('#call').val()
        let eventSport = $('#sport').val()
        let eventOpponent = $('#opponent').val()
        let eventLocation = $('#location').val()
        $.ajax({
            method: 'PUT',
            url: `/api/events/${eventId}`,
            data: JSON.stringify({
                date: eventDate,
                time: eventTime,
                call: eventCall,
                sport: eventSport,
                opponent: eventOpponent,
                location: eventLocation
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: response => {
                $('.message').html(`<p>Success</p>`)
                $('.event-edit').prop('hidden', true)
            }
        })
    })

    $('.schedule').on('click', '.cancel-update-button', (e) => {
        e.preventDefault()
        $('.event-edit').prop('hidden', true)
    })
}



// Edit or Delete Event Categories
function handleEditEventCategoriesClick() {
    $('#edit-categories').on('click', (e) => {
        e.preventDefault()
        $('.category-fieldset').prop('hidden', false)
        $('.schedule').prop('hidden', true)
        $('.schedule-button').prop('hidden', false)
    })
}

function handleSelectCategory() {
    $('.edit-submit').on('click', (e) => {
        e.preventDefault()
        $('.category-values').html('')
        let category = $('#category').val().toLowerCase()
        $('#category').val("")
        $.ajax({
            method: 'GET',
            url: `/api/${category}`,
            success: response => {
                if (category === 'sports') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}" class="category-edit">
                            <p class="${response[index].sport} category-edit">${response[index].sport}</p>
                            <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                            <form class="edit-item-form ${response[index].id}" hidden>
                                <label for="edit-item-input">Enter new value</label>
                                <input type="text" id="edit-item-input" name="edit-item-input" class="edit-item-input">
                                <button type="submit" class="edit-put-submit">Submit</button>
                            </form>
                        </div>
                         `)
                    }
                } else if (category === 'opponents') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}" class="category-edit">
                            <p class="${response[index].opponent} category-edit">${response[index].opponent}</p>
                            <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                            <form class="edit-item-form ${response[index].id}" hidden>
                                <label for="edit-item-input">Enter new value</label>
                                <input type="text" id="edit-item-input" class="edit-item-input">
                                <button type="submit" class="edit-put-submit">Submit</button>
                            </form>
                            </div>
                             `)
                    }
                } else if (category === 'locations') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}" class="category-edit">
                                <p class="${response[index].location} category-edit">${response[index].location}</p>
                                <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                                <button class="edit-button">Edit</button>
                                <button class="delete-button">Delete</button>
                                <form class="edit-item-form ${response[index].id}" hidden>
                                    <label for="edit-item-input">Enter new value</label>
                                    <input type="text" id="edit-item-input" class="edit-item-input">
                                <button type="submit" class="edit-put-submit">Submit</button>
                            </form>
                                </div>
                                 `)
                    }
                } else if (category === 'positions') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}" class="category-edit">
                                    <p class="${response[index].position} category-edit">${response[index].position}</p>
                                    <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                                    <button class="edit-button">Edit</button>
                                    <button class="delete-button">Delete</button>
                                    <form class="edit-item-form ${response[index].id}" hidden>
                                        <label for="edit-item-input">Enter new value</label>
                                        <input type="text" id="edit-item-input" class="edit-item-input">
                                        <button type="submit" class="edit-put-submit">Submit</button>
                                    </form>
                                    </div>
                                     `)
                    }

                }
                $('.category').trigger('reset')
            },
            error: error => console.log(error)
        })
        $('.category-values').prop('hidden', false)
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

function deleteCategoryItem() {
    $('.category-values').on('click', '.delete-button', (e) => {
        e.preventDefault()
        const category = $(e.currentTarget).parent('div').attr('id')
        const id = $(e.currentTarget).siblings('.id').attr('id')
        console.log(id)
        $.ajax({
            method: 'DELETE',
            url: `/api/${category}/${id}`,
            success: response => {
                $('.message').html(`<p>Deleted successfully.</p>`)
                $(e.currentTarget).parent('div').remove()
            },
            error: error => {
                $('.message').html(`<p>Please fill out all fields</p>`)
            }
        })
    })
}


function handleEditCategoryItem() {
    $('.category-values').on('click', '.edit-button', (e) => {
        e.preventDefault()
        const category = $(e.currentTarget).parent('div').attr('id')
        const id = $(e.currentTarget).siblings('.id').attr('id')
        $(`.${id}`).prop('hidden', false)
        $('.category-values').prop('hidden', false)
        $('.edit-item-form').on('click', '.edit-put-submit', (e) => {
            e.preventDefault()
            let newData = null
            console.log($('.edit-item-input').val())
            if (category === 'sports') {
                newData = { "id": id, "sport": $('.edit-item-input').val() }
            } else if (category === 'opponents') {
                newData = { "id": id, "opponent": $('.edit-item-input').val() }
            } else if (category === 'locations') {
                newData = { "id": id, "location": $('.edit-item-input').val() }
            } else if (category === 'positions') {
                newData = { "id": id, "position": $('.edit-item-input').val() }
            }
            $.ajax({
                method: 'PUT',
                url: `/api/${category}/${id}`,
                data: JSON.stringify(newData),
                contentType: 'application/json',
                dataType: 'json',
                success: response => {
                    $('.message').html(`<p>Item edited successfully, page will reload.</p>`)
                }
            })
            setTimeout(() => { location.reload(true) }, 3000)
        })
    })
}

function deleteAndEditCategories() {
    handleEditEventCategoriesClick()
    handleEditCategoryItem()
    handleSelectCategory()
    deleteCategoryItem()
    handleEditEventSubmit()
}

function handleAdminDashboard() {
    getEvents()
    editEvent()
    deleteEvent()
    deleteAndEditCategories()
    watchSignOutClick()
}

handleAdminDashboard()