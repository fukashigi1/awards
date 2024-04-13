function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(()=>{
    let loginButton = document.getElementById('loginButton')
    let signupButton = document.getElementById('signupButton')

    loginButton.addEventListener('click', () => {
        window.location.href = '/login'
    })

    signupButton.addEventListener('click', () => {
        window.location.href = '/register'
    })
});