function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    let loginForm = document.getElementById('loginForm')


    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        let usernameEmailInput = document.getElementById('usernameEmailInput').value.trim()
        let passwordInput = document.getElementById('passwordInput').value.trim()

        let usernameEmailError, passwordError = false

        if (usernameEmailInput === '') {
            setError(document.getElementById('usernameEmailInput'), "Username or email field cannot be empty.")
            usernameEmailError = true
        } else {
            setError(document.getElementById('usernameEmailInput'), "", false)
            usernameEmailError = false
        }

        if (passwordInput === '') {
            setError(document.getElementById('passwordInput'), "Password field cannot be empty.")
            passwordError = true
        } else {
            setError(document.getElementById('passwordInput'), "", false)
            passwordError = false
        }

        if(!usernameEmailError && !passwordError) {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usernameEmailInput: usernameEmailInput,
                        passwordInput: passwordInput
                    })
                })

                if (response.status === 500) {
                    throw new Error('An unexpected internal error has ocurred.')
                }
                
                const data = await response.json()
                console.log(data)

                if (data.length > 0 && data.constructor === Array) {
                    let element;
                    let msg;
                    data.forEach(index => {
                        element = index.element
                        msg = index.msg
                        if (element === 'usernameEmailInput') {
                            setError(document.getElementById('usernameEmailInput'), msg)
                            usernameError = true
                        } else if (element === 'passwordInput') {
                            setError(document.getElementById('passwordInput'), msg)
                            emailError = true
                        } 
                    });
                } else {
                    executeModal('success', data, 'okSuccess')
                }

                if (response.status === 200) window.location.href = '/main'
                
            } catch (e) {
                console.error('An unexpected error has ocurred during fetch.')
            }
        }
        
    })



    dynamicEvent('click', 'okSuccessButton', ()=>{
        window.location.href = '/login'
    })
})