
function executeModal(type, text = '', buttons){
    let icon = ''
    switch (type) {
        case 'error':
            icon = '<i class="fa-solid fa-circle-xmark" style="color: #f36969;"></i>'
            if (text == '')
                text = 'An unexpected error has ocurred.'
            break;
        case 'success':
            icon = '<i class="fa-solid fa-circle-check" style="color: #4ec579;"></i>'
            if (text == '')
                text = 'Action completed succesfully.'
            break;
        case 'warning':
            icon = '<i class="fa-solid fa-circle-exclamation" style="color: #e1be3f;"></i>'
            if (text == '')
                text = 'Warning, be careful.'
            break;
        case 'info':
            icon = '<i class="fa-solid fa-circle-info" style="color: #74C0FC;"></i>'
            if (text == '')
                text = 'Did you know that this is a default info message?'
            break;
        default: 
            break;
    }
    let globalModal = `
    <div class="modalBackground" id="modalBackground">
        <div class="globalModal">
            <div class="modalBody">
                ${icon}
                <span>${text}</span>
            </div>
            <div class="modalButtonWrapper">`
    switch (buttons) {
        case 'continue':
            globalModal += `<button id="continueButton">Continue</button>`
            break;
        case 'continueCancel':
            globalModal += `
                        <button id="cancelButton">Cancel</button>
                        <button id="continueButton">Continue</button>`
            break;
        case 'cancel':
            globalModal += `<button id="cancelButton">Cancel</button>`
            break;
        case 'okError':
            globalModal += `<button id="okErrorButton">OK</button>`
            break;
        case 'okSuccess':
            globalModal += `<button id="okSuccessButton">OK</button>`
            break;
        default:
            globalModal += `
                        <button id="cancelButton">Cancel</button>
                        <button id="continueButton">Continue</button>`
            break;
    }
                
    globalModal += `
            </div>
        </div>
    </div>`
    document.body.insertAdjacentHTML('afterbegin', globalModal)
}

document.addEventListener('DOMContentLoaded', () => {
    //ANIMACION
    dynamicEvent('click', 'cancelButton', ()=>{
        while (document.getElementsByClassName('modalBackground')[0]){
            document.getElementsByClassName('modalBackground')[0].remove();
        }
    })

    dynamicEvent('click', 'okErrorButton', ()=>{
        while (document.getElementsByClassName('modalBackground')[0]){
            document.getElementsByClassName('modalBackground')[0].remove();
        }
    })
    
    dynamicEvent('click', 'modalBackground', ()=>{
        while (document.getElementsByClassName('modalBackground')[0]){
            document.getElementsByClassName('modalBackground')[0].remove();
        }
    })
})

function dynamicEvent(type, element, fn) {
    document.querySelector("body").addEventListener(type, (e) => {
        if (e.target && e.target.id === element) {
            fn()
        }
    })
}

function validateEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

function setError(element, message, type = true) {
    element.nextElementSibling.textContent = message;
    if (type) { // true for set the error and false to remove it
        // add red border
    } else {
        // remove red border
    }
}

/*dynamicEvent('click', 'ccCancelButton', ()=>{
    while (document.getElementsByClassName('modalBackground')[0]){
        document.getElementsByClassName('modalBackground')[0].remove();
    }
})*/
