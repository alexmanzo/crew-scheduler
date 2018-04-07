$('.register-form').on('submit', event => {
	event.preventDefault()
	let username = $('.username').val()
	let password = $('.password').val()

	$.ajax({
		method: 'POST',
		url:'/api/users/',
		data: JSON.stringify({username, password}),
		contentType: 'application/json',
		dataType: 'json',
		success: response => window.location = "login.html",
		error: error => console.log(error)

	})
})
