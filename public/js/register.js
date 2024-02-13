function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function setError(element, message, type = true) {
    element.nextElementSibling.textContent = message;
    if (type) { // true for set the error and false to remove it
        // add red border
    } else {
        // remove red border
    }
}

ready(()=>{
    let registerForm = document.getElementById('registerForm')
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        let usernameInput = document.getElementById('usernameInput')
        let emailInput = document.getElementById('emailInput')
        let emailConfirmInput = document.getElementById('emailConfirmInput')
        let passwordInput = document.getElementById('passwordInput')
        let passwordConfirmInput = document.getElementById('passwordConfirmInput')
        
        let usernameError, emailError, emailConfirmError, passwordError, passwordConfirmError = false
            
        if (usernameInput.value.trim() === '') {
            setError(usernameInput, "Username field cannot be empty.")
            usernameError = true
        } else {
            setError(usernameInput, "", false)
            usernameError = false
        }
        if (emailInput.value.trim() === '') {
            setError(emailInput, "Email field cannot be empty.")
            emailError = true
        } else if (!validateEmail(emailInput.value.trim())) {
            setError(emailInput, "The email entered is not valid.")
            emailError = true
        } else {
            setError(emailInput, "", false)
            emailError = false
        }
        if (emailConfirmInput.value.trim() === '') {
            setError(emailConfirmInput, "Email confirmation field cannot be empty.")
            emailConfirmError = true
        } else if (emailInput.value.trim() !== emailConfirmInput.value.trim()) {
            setError(emailConfirmInput, "The emails entered are not the same.")
            emailConfirmError = true
        } else {
            setError(emailConfirmInput, "", false)
            emailConfirmError = false
        }
        if (passwordInput.value.trim() === '') {
            setError(passwordInput, "Password field cannot be empty.")
            passwordError = true
        } else {
            setError(passwordInput, "", false)
            passwordError = false
        }
        if (passwordConfirmInput.value.trim() === '') {
            setError(passwordConfirmInput, "Password confirmation field cannot be empty.")
            passwordConfirmError = true
        } else if (passwordInput.value.trim() !== passwordConfirmInput.value.trim()) {
            setError(passwordConfirmInput, "The passwords entered are not the same.")
            passwordConfirmError = true
        } else {
            setError(passwordConfirmInput, "", false)
            passwordConfirmError = false
        }
        if (!usernameError && !emailError && !emailConfirmError && !passwordError && !passwordConfirmError) {
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usernameInput: usernameInput.value.trim(),
                        emailInput: emailInput.value.trim(),
                        emailConfirmInput: emailConfirmInput.value.trim(),
                        passwordInput: passwordInput.value.trim(),
                        passwordConfirmInput: passwordConfirmInput.value.trim()
                    })
                })
                if (response.status === 500) {
                    throw new Error('An unexpected internal error has ocurred.')
                }
                const data = await response.json()
                if (data.length > 0 && data.constructor === Array) {
                    let element;
                    let msg;
                    data.forEach(index => {
                        element = index.element
                        msg = index.msg
                        if (element === 'usernameInput') {
                            setError(usernameInput, msg)
                            usernameError = true
                        } else if (element === 'emailInput') {
                            setError(emailInput, msg)
                            emailError = true
                        } else if (element === 'emailConfirmInput') {
                            setError(emailConfirmInput, msg)
                            emailConfirmError = true
                        } else if (element === 'passwordInput') {
                            setError(passwordInput, msg)
                            passwordError = true
                        } else if (element === 'passwordConfirmInput') {
                            setError(passwordConfirmInput, msg)
                            passwordConfirmError = true
                        }
                    });
                } else {
                    executeModal('success', data, 'okSuccess')
                }
                
            } catch (e) {
                executeModal('error', e.message, 'okError')
            }
        }
    })

    dynamicEvent('click', 'okSuccessButton', ()=>{
        window.location.href = '/login'
    })
});