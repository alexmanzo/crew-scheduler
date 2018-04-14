$('.login-form').on('submit', event => {
	event.preventDefault()
	let username = $('.username').val()
	let password = $('.password').val()

	$.ajax({
		method: 'POST',
		url:'/api/auth/login',
		data: JSON.stringify({username, password}),
		contentType: 'application/json',
		dataType: 'json',
		success: response => {
			localStorage.setItem('token', response.authToken)
			localStorage.setItem('user', username)
			window.location = "admin-dashboard.html"
		},
		error: error => {
			$('.message').html('Username or password incorrect')
		}
	})
})