const form = document.getElementById('form');
const inputFields = document.querySelectorAll('input')
let dateData = {}

const validateInputs = () => {

    for (const input of inputFields) {
        dateData[input.name] = input.value;
    }

    for (const data in dateData) {
       if (dateData[data] === '') {
        console.log('Missing')
       }
    }

    /* if (missingValue) {
        hasError(missingValue)
    } */
    
    // console.log(missingValue)
    // console.log(dateData);
}

const hasError = (element, message) => {
    missingValue.classList.add('has-erro');
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    validateInputs()
})