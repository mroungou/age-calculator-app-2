const form = document.getElementById('form');
const inputFields = document.querySelectorAll('input')
const inputsDiv = document.getElementById('inputs');
const inputs = document.getElementsByClassName('input');
let dateData = {}

const validationMessage = {
    'empty': 'This field is required',
}

const validateInputs = () => {

    for (const input of inputFields) {
        dateData[input.name] = input.value;
    }

    for (const data in dateData) {
       if (dateData[data] === '') {
        /* the Object.keys(dateDate) extracts all the keys/properties of dateData
        for the dateData obj it returns day, month and year
        the keys are then in an array
        indexOf(data) then looks for the position of data that has no value */
        const index = Object.keys(dateData).indexOf(data);
        hasError(inputs[index], validationMessage.empty);
       }
    }

    /* if (missingValue) {
        hasError(missingValue)
    } */
    
    // console.log(missingValue)
    // console.log(dateData);
}

const hasError = (element, message) => {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.className = 'error-div';

    element.parentElement.classList.add('has-error');
    element.appendChild(errorDiv)
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    validateInputs()
})