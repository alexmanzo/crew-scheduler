//API Requests to populate form data
function getSportsForForm(callback) {
    $.ajax({
    	method: 'GET',
    	url: '/api/sports',
    	success: callback,
        error: error => console.log('error: sports cannot be displayed')
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

populateAllForms()

// Add new values to API

function getNewSport(callback) {
	$('.js-new-sport-button').on('click', e => {
		e.preventDefault()
		let newSport = $('.js-new-sport').val()
		$('#new-sport').val("")
		$.ajax({
			method: 'POST',
			url: '/api/sports',
			data: JSON.stringify({sport: newSport}),
			contentType: 'application/json',
			dataType: 'json',
			success: callback,
			error: error => console.log(error)
		})
	})
}

function addNewSportToForm(data) {
	$("#sport").append(
			`<option value="${data.sport}">${data.sport}</option>`
			)
}

function getNewOpponent(callback) {
	$('.js-new-opponent-button').on('click', e => {
		e.preventDefault()
		let newOpponent = $('.js-new-opponent').val()
		$('#new-opponent').val("")
		$.ajax({
			method: 'POST', 
			url: '/api/opponents',
			data: JSON.stringify({opponent: newOpponent}),
			contentType: 'application/json',
			dataType: 'json',
			success: callback,
			error: error => console.log(error)
		})
	})
}

function addNewOpponentToForm(data) {
	$("#opponent").append(
			`<option value="${data.opponent}">${data.opponent}</option>`
			)
}

function getNewLocation(callback) {
	$('.js-new-location-button').on('click', e => {
		e.preventDefault()
		let newLocation = $('.js-new-location').val()
		$('#new-location').val("")
		$.ajax({
			method: 'POST', 
			url: '/api/locations',
			data: JSON.stringify({location: newLocation}),
			contentType: 'application/json',
			dataType: 'json',
			success: callback,
			error: error => console.log(error)
		})
	})
}

function addNewLocationToForm(data) {
	$("#location").append(
			`<option value="${data.location}">${data.location}</option>`
			)
}

function addNewValuesToForm() {
	getNewSport(addNewSportToForm)
	getNewOpponent(addNewOpponentToForm)
	getNewLocation(addNewLocationToForm)
}



addNewValuesToForm()





