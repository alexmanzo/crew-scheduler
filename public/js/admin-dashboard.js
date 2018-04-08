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

// Edit Event Categories

function handleEditEventCategoriesClick() {
    $('#edit-categories').on('click', (e) => {
        e.preventDefault()
        $('.category-fieldset').prop('hidden', false)
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
                            `<p class="${response[index].sport}">${response[index].sport}</p>
                            <p>edit</p><p>delete</p>
                             `)
                            }
                        } else if (category === 'opponents') {
                            for (index in response) {
                                $(".category-values").append(
                                `<p class="${response[index].opponent}">${response[index].opponent}</p>
                                <p>edit</p><p>delete</p>
                                 `)
                                }
                            } else if (category === 'locations') {
                                for (index in response) {
                                    $(".category-values").append(
                                    `<p class="${response[index].location}">${response[index].location}</p>
                                    <p>edit</p><p>delete</p>
                                     `)
                                    }
                                } else if (category === 'positions') {
                                    for (index in response) {
                                        $(".category-values").append(
                                        `<p class="${response[index].position}">${response[index].position}</p>
                                        <p>edit</p><p>delete</p>
                                         `)
                                        }

                                  }
                    $('.category').trigger('reset')              
                },
                error: error => console.log(error)
            })
        })
}



handleEditEventCategoriesClick()
handleSelectCategory()

getAndDisplayEvents()