
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
        case 'accept':
            globalModal += `<button id="acceptButton" class="primaryButton" style="width: 5rem;">Ok</button>`
            break;
        case 'acceptCancel':
            globalModal += `
                        <button id="acceptButton" class="primaryButton" style="width: 5rem;">Accept</button>
                        <button id="cancelButton" class="secondaryButton" style="width: 5rem;">Cancel</button>`
            break;
        default:
            globalModal += buttons
            break;
    }
                
    globalModal += `
            </div>
        </div>
    </div>`
    document.body.insertAdjacentHTML('afterbegin', globalModal)
}




document.addEventListener('DOMContentLoaded', () => {
    dynamicEvent('click', 'cancelButton', ()=>{
        closeModal()
    })
})
function closeModal() {
    let background = document.getElementsByClassName('modalBackground')[0];
    let modal = document.getElementsByClassName('globalModal')[0];
    modal.classList.add('hide-modal');
    background.classList.add('hide-modal-background');
    setTimeout(()=> {
        background.remove();
    }, 200)
}

function dynamicEvent(type, element, fn) {
    document.querySelector("body").addEventListener(type, (e) => {
        if (e.target && e.target.id === element) {
            fn()
        }
    })
}

function dynamicEventClass(type, className, fn) {
    document.querySelector("body").addEventListener(type, (e) => {
        fn(e);
    });
}
function validateEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

function setError(element, message, type = true) {
    element.nextElementSibling.textContent = message;
    console.log(element)
    if (type) { // true for set the error and false to remove it
        element.classList.add('inputErrorBorder')
    } else {
        element.classList.remove('inputErrorBorder')
    }
}

/*dynamicEvent('click', 'ccCancelButton', ()=>{
    while (document.getElementsByClassName('modalBackground')[0]){
        document.getElementsByClassName('modalBackground')[0].remove();
    }
})*/
