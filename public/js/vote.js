function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(async ()=>{
    let hash = window.location.href.split('/')[4]
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
    try {
        

    } catch (e) {
        console.error('An unexpected error has ocurred during fetch.')
    }

    function displayQuestions(data) {
        for(let question of data) {
            let $question = `
                <div class="questionWrapper" data-uuid="${question.id}">
                    <div class="questionTitleWrapper">
                        <h4>${question.question}</h4>
                    </div>`
                    if (validateUrl(question.url) == 'youtube') {
                        $question += `
                        <div class="questionUrlWrapper">
                            <iframe src="//www.youtube-nocookie.com/embed/${getId(question.url)}" frameborder="0" allowfullscreen></iframe>
                        </div>`
                    } else if (validateUrl(question.url) == 'image') {
                        $question += `
                        <div class="questionUrlWrapper">
                            <img src="${question.url}"</img>
                        </div>`
                    }
            $question += `
                    <div class="votationWrapper">`
                    switch (question.question_type) {
                        case 1: // radio
                            break;
                        case 2: // checkbox
                            break;
                        case 3: // color
                            break;
                        case 4: // date
                            break;
                        case 5: // rate
                            break;
                        case 6: // input
                            break;
                    }
            $question += `
                    </div>
                </div>`
                document.getElementById('questionsWrapper').innerHTML += $question
        }
    }

    function validateUrl(url){
        let ytRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/
        let imageRegex = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?\.(jpg|jpeg|png|gif|svg)$/

        if (ytRegex.test(url)) {
            return 'youtube';
        } else if (imageRegex.test(url)) {
            return 'image';
        } else {
            return null;
        }
    }

    function getId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        return (match && match[2].length === 11)
          ? match[2]
          : null;
    }
});