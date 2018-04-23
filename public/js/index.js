$('.admin-login').on('click', e => {
	e.preventDefault()
	window.location = "admin-login.html"
})

$('.crew-login').on('click', e => {
	e.preventDefault()
	window.location = "crew-login.html"
})

$('.register-form').on('click', '.register-button', e => {
	e.preventDefault()
	let firstName = $('.first-name').val()
	let lastName = $('.last-name').val()
	let username = $('.username').val()
	let password = $('.password').val()
	let email = $('.email').val()
	let role = $('.role').val()

		$.ajax({
			method: 'POST',
			url:'/api/users/',
			data: JSON.stringify({username, password, firstName, lastName, email, role}),
			contentType: 'application/json',
			dataType: 'json',
			success: response =>  {
				if (role === 'An Event Scheduler') {
					return window.location = "admin-login.html"
				} else if (role === 'A Crew Member') {
					return window.location = "crew-login.html"
				}	

			},
			error: error => {
				const parsedResponse = JSON.parse(error.responseText)
				if (parsedResponse.message.toLowerCase() === 'username already taken') {
					$(".message").html(`<p class="message">Error: ${parsedResponse.message.toLowerCase()}</p>`)
				} else {
					$(".message").html(`<p class="message">Error: ${parsedResponse.location} ${parsedResponse.message.toLowerCase()}</p>`)
				}
          	}

		})
	
})



