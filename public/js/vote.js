function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(async ()=>{
    
    try {
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
                            <img src="${question.url}" />
                        </div>`
                    }
            $question += `
                    <div class="votationWrapper">`
                    $question += `
                    <div class="questionDescription">
                        <span>${question.description}</span>
                    </div>`
                    let insertChoices, choices
                    console.log(question)
                    if (question.question_choices != null) {
                        choices = question.question_choices.split(';')
                    }
                    
                    switch (question.question_type) {
                        case 1: // radio

                            insertChoices = `<div class="radioWrapper">`
                            if (question.question_choices != null) {
                                for (let choice of choices) {
                                    insertChoices += `  
                                            <label class="containerRadio">${choice}
                                                <input type="radio" id="${choice}" name="${question.id}"></input>
                                                <span class="checkmarkRadio"></span>
                                            </label>`
                                }
                            } else {
                                insertChoices += `
                                <div class="errorEmptyChoices">
                                    <span>Han error has ocurred and this question aparently have no choices.</span>
                                </div>
                                `
                            }

                            insertChoices += `</div>`

                            break;
                        case 2: // checkbox
                            
                            insertChoices = `<div class="radioWrapper">`
                            if (question.question_choices != null) {
                                for (let choice of choices) {
                                    insertChoices += `  
                                            <label class="containerCheckbox">${choice}
                                                <input type="checkbox" id="${choice}" name="${question.id}"></input>
                                                <span class="checkmarkCheckbox"></span>
                                            </label>`
                                }
                            } else {
                                insertChoices += `
                                <div class="errorEmptyChoices">
                                    <span>Han error has ocurred and this question aparently have no choices.</span>
                                </div>
                                `
                            }
                        
                            insertChoices += `</div>`

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
                    $question += insertChoices
            $question += `
                        <div class="questionFooter">
                            <button class="primaryButton" Style="width: 120px">Next</button>
                        </div>
                    </div>
                </div>`
                document.getElementById('questionsWrapper').innerHTML += $question
        }
    }

    dynamicEventClass('click', 'questionUrlWrapper', (e) => {
        const wrapper = e.target.closest('.questionUrlWrapper');
        let imgSrc = wrapper.children[0].getAttribute('src')
        if (imgSrc != undefined) {
            let body = `
                <div class="zoomedImageWrapper">
                    <img src="${imgSrc}">
                </div>
            `
            let buttons = `
                <button class="primaryButton" id="closeButton">Close</button>
            `

            executeModal({type: 'other', buttons, body})
        }
    });
    dynamicEvent('click', 'closeButton', (e) => {
        closeModal()
    });

});
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