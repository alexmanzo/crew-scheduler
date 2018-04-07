$('.register-form').on('submit', event => {
    event.preventDefault()
    let firstName = $('.first-name').val()
    let lastName = $('.last-name').val()
    let username = $('.username').val()
    let password = $('.password').val()
    let role = $('.role').val()

    $.ajax({
        method: 'POST',
        url: '/api/users/',
        data: JSON.stringify({ username, password, firstName, lastName, role }),
        contentType: 'application/json',
        dataType: 'json',
        success: response => {
            if (role === 'An Event Scheduler') {
                return window.location = "admin-login.html"
            } else if (role === 'A Crew Member') {
                return window.location = "crew-login.html"
            }

        },
        error: error => {
            $('.message').html('Please fill in all values.')
        }

    })

})