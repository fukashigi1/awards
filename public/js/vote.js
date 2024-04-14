function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(async ()=>{
    let hash = window.location.href.split('/')[4]
    try {
        const response = await fetch(`/vote/obtainaward/${hash}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
        })

        if (response.status === 500) {
            throw new Error('An unexpected internal error has ocurred.')
        }
        
        const data = await response.json()
        displayQuestions(data)

    } catch (e) {
        console.error('An unexpected error has ocurred during fetch.')
    }

    function displayQuestions(data) {
        for(let question of data) {
            console.log(question)
        }
    }
});