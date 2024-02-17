function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    let loginForm = document.getElementById('loginForm')

    let usernameEmailInput = document.getElementById('usernameEmailInput').value.trim()
    let passwordInput = document.getElementById('passwordInput').value.trim()

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
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
            // fetch y hacer logout
        }
        
    })



    dynamicEvent('click', 'okSuccessButton', ()=>{
        window.location.href = '/login'
    })
})