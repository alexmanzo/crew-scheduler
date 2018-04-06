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

