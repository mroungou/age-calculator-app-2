const form = document.getElementById('form');
const inputFields = document.querySelectorAll('input')
const inputsDiv = document.getElementById('inputs');
const inputs = document.getElementsByClassName('input-div');
const yearOutput = document.getElementById('year-output');
const monthOutput = document.getElementById('month-output');
const dayOutput = document.getElementById('day-output');
let dateData = {} // storing the day, month, and year

const validationMessage = {
    'empty': 'This field is required',
    'past': 'Must be in the past'
}
/* using timestamps - getting the difference in ms from 1970
- once the diff has been obtained dividing to get the total years, age, months
- this accounts for leap years automatically
- much more precise than the JDN algorithm;
*/
const calculateAgeMS = (diffInMs) => {
    const ageInYears = Math.floor(diffInMs / 3.154e+10)
    const ageMonths = Math.floor((diffInMs % 3.154e+10) / 2.628e+9)
    const ageDays = Math.floor(((diffInMs % 3.154e+10) % 2.628e+9) / 8.64e+7)
    const daysOnEarth = diffInMs / 8.64e+7;

    yearOutput.innerText = ageInYears;
    monthOutput.innerText = ageMonths;
    dayOutput.innerText = ageDays;
    console.log(ageInYears, ageMonths, ageDays, daysOnEarth);
}


/* the julian day algorithm */
/* 
const calculateAge = (currentDay, currentMonth, currentYear, 
    birthDate, birthMonth, birthYear) => {
        const gregorianAdj = 2 - (birthYear / 100) + (birthYear / 400)
        const gregorianAdjCurrent = 2 - (currentYear / 100) + (currentYear / 400)

        // const JDNBirth = ((365.25 * (birthYear + 4716))) + (30.6001 * (birthMonth + 1)) + birthDate + 0 - 1524.5;
        const JDNBirth = Math.floor(365.25 * (birthMonth === 1 || birthMonth === 2 ? birthYear - 1 : birthYear + 4716)) + 
        Math.floor(30.6001 * (birthMonth === 1 ? 13 : (birthMonth === 2 ? 14 : birthMonth  + 1))) 
        + birthDate - 1524.5
        // const JDNCurrentYear = ((365.25 * (currentYear + 4716))) + (30.6001 * (currentMonth + 1)) + currentDay + 0 - 1524.5;
        const JDNCurrentYear = Math.floor(365.25 * (currentMonth === 1 || currentMonth === 2 ? currentYear - 1 : currentYear + 4716)) + 
        Math.floor(30.6001 * (currentMonth === 1 ? 13 : (currentMonth === 2 ? 14 : currentMonth  + 1))) 
        + currentDay - 1524.5


        const diffDays = JDNCurrentYear - JDNBirth;
        const years = Math.floor((diffDays / 365.25));
        const daysRemaining = diffDays - (years * 365.25);
        const months = Math.floor((daysRemaining / 30.44))
        const days = Math.floor(daysRemaining - (months * 30.44))


        yearOutput.innerText = years;
        monthOutput.innerText = months;
        dayOutput.innerText = days;
        console.log(`birth ${JDNBirth}, current ${JDNCurrentYear}, difference ${diffDays}`);
} */

const validateInputs = () => {
   /* getting the name of the input and setting the value in the dateDate obj */
    inputFields.forEach(input => {
        dateData[input.name] = input.value; // this will get the value of day, month, year

        // checks if an input was empty and handles the error
        if (input.value === '') {
            hasError(input, validationMessage.empty)
        } else {
            hasNoError(input)
        }
    })

    if (Object.values(dateData).every(value => value !== '')) {
        const birthday = Date.parse(`${dateData.month}-${dateData.day}-${dateData.year}`)
        const dateToday = Date.now()
        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth() + 1; /* adding 1 as zero index */
        const currentDay = new Date().getDate()
        const diffMS = dateToday - birthday;
        
        if (birthday > dateToday) {
            if (dateData.year > currentYear) {
                hasError(inputFields[2], validationMessage.past)
            }
        }

        // using the JDN algorithm had issues with the months jan and feb when calculating the age in years

        /* calculateAge(currentDay, currentMonth, currentYear, 
            parseInt(dateData.day), parseInt(dateData.month), parseInt(dateData.year)) */

        calculateAgeMS(diffMS)
    }

}

const hasError = (element, message) => {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.className = 'error-div';

    const parent = element.parentElement;

    if (!parent.querySelector('.error-div')) {
        parent.parentElement.classList.add('has-error');
        parent.appendChild(errorDiv);
    }

}

const hasNoError = (element) => {
    const parent = element.parentElement;
    console.log(parent);
    const errorDiv = parent.querySelector('.error-div');



    if (errorDiv) {
        parent.parentElement.classList.remove('has-error');
        errorDiv.remove();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    validateInputs()
})