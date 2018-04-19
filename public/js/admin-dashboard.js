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
//Edit or Delete Events
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

function editEvent() {
    $('.schedule').on('click', '.edit-event-button', (e) => {
        e.preventDefault()

        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
        let id = $(e.currentTarget).parent('div').attr('id')
        let currentDate = formatDate($(e.currentTarget).siblings('.date').text())
        let currentTime = $(e.currentTarget).siblings('.time').text().slice(0, 5).split(':')

        function formatEventTime(currentTime) {
            if ($(e.currentTarget).siblings('.time').text().includes('PM')) {
                let hour = parseInt(currentTime[0])
                hour += 12
                currentTime.splice(0, 1, hour.toString())
                return currentTime.join(':')
            } else {
                return currentTime.join(':')
            }
        }
        let timeForForm = formatEventTime(currentTime)
        let currentCall = $(e.currentTarget).siblings('.call').text().slice(0, 5).split(':')

        function formatCallTime(currentCall) {
            if ($(e.currentTarget).siblings('.call').text().includes('PM')) {
                let hour = parseInt(currentCall[0])
                hour += 12
                currentCall.splice(0, 1, hour.toString())
                return currentCall.join(':')
            } else {
                return currentCall.join(':')
            }
        }
        let callForForm = formatCallTime(currentCall)
        let currentSport = $(e.currentTarget).siblings('.sport').text()
        let currentOpponent = $(e.currentTarget).siblings('.opponent').text()
        let currentLocation = $(e.currentTarget).siblings('.location').text()

        populateAllForms()

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
                    </form>`)

    })
    //API Requests to populate form data
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
                            `<div id="${category}">
                            <p class="${response[index].sport}">${response[index].sport}</p>
                            <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                        </div>
                         `)
                    }
                } else if (category === 'opponents') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}">
                            <p class="${response[index].opponent}">${response[index].opponent}</p>
                            <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                            </div>
                             `)
                    }
                } else if (category === 'locations') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}">
                                <p class="${response[index].location}">${response[index].location}</p>
                                <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                                <button class="edit-button">Edit</button>
                                <button class="delete-button">Delete</button>
                                </div>
                                 `)
                    }
                } else if (category === 'positions') {
                    for (index in response) {
                        $(".category-values").append(
                            `<div id="${category}">
                                    <p class="${response[index].position}">${response[index].position}</p>
                                    <p class="id" id="${response[index].id}" hidden>${response[index].id}</p>
                                    <button class="edit-button">Edit</button>
                                    <button class="delete-button">Delete</button>
                                    </div>
                                     `)
                    }

                }
                $('.category').trigger('reset')
            },
            error: error => console.log(error)
        })
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

function deleteItem() {
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


function handleEditItemClick() {
    $('.category-values').on('click', '.edit-button', (e) => {
        e.preventDefault()
        const category = $(e.currentTarget).parent('div').attr('id')
        console.log(category)
        const id = $(e.currentTarget).siblings('.id').attr('id')
        $('.edit-item-form').prop('hidden', false)
        $('.edit-item').on('click', '.edit-put-submit', (e) => {
            e.preventDefault()
            let newData = null
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
            setTimeout(() => { location.reload(true) }, 2000)
        })
    })
}

function deleteAndEditCategories() {
    handleEditEventCategoriesClick()
    handleEditItemClick()
    handleSelectCategory()
    deleteItem()
}




deleteAndEditCategories()
getEvents()
deleteEvent()
editEvent()
handleEditEventSubmit()
watchSignOutClick()