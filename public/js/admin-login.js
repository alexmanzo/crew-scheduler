function handleLogin(callback) {
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
			success: callback,
			error: error => {
				$('.message').html('Username or password incorrect')
			}
		})
	})
}	

function saveUser(response) {
	let username = $('.username').val()
	localStorage.setItem('token', response.authToken)
     $.ajax({
            method: 'GET',
            url: `/api/users/${username}`,
            success: res => {
            	const userFullName = `${res[0].firstName} ${res[0].lastName}`
            	localStorage.setItem('user', userFullName)
            	localStorage.setItem('username', res[0].username)
            	localStorage.setItem('role', res[0].role)
            	window.location = "admin-dashboard.html" 
            },
            error: error => console.log('error')
     })

}


handleLogin(saveUser) 

