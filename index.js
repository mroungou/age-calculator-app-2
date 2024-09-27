import { isExists } from "https://cdn.skypack.dev/date-fns/isExists.mjs";
import { isPast } from "https://cdn.skypack.dev/date-fns/isPast.mjs"
import { differenceInCalendarDays } from "https://cdn.skypack.dev/date-fns/differenceInCalendarDays.mjs";
import { getDaysInMonth } from "https://cdn.skypack.dev/date-fns/getDaysInMonth.mjs";

const form = document.getElementById('form');
const inputFields = document.querySelectorAll('input')
const yearOutput = document.getElementById('year-output');
const monthOutput = document.getElementById('month-output');
const dayOutput = document.getElementById('day-output');
let dateData = {} // storing the day, month, and year
let currentDateDate = {
    currentYear : new Date().getFullYear(),
    currentMonth : new Date().getMonth(),
    currentDay : new Date().getDate()
}

const validationMessage = {
    'empty': 'This field is required',
    'past': 'Must be in the past',
    'invalid': 'Must be a valid :attribute'
}
/* using timestamps - getting the difference in ms from 1970
- once the diff has been obtained dividing to get the total years, age, months
- this accounts for leap years automatically
- much more precise than the JDN algorithm;
*/
/* const calculateAgeMS = (diffInMs) => {
    const ageInYears = Math.floor(diffInMs / 3.154e+10)
    const ageMonths = Math.floor((diffInMs % 3.154e+10) / (30.44 * 8.64e+7))
    const ageDays = Math.floor(((diffInMs % 3.154e+10) % (30.44 * 8.64e+7)) / 86400000)
    const daysOnEarth = diffInMs / 8.64e+7;

    yearOutput.innerText = ageInYears;
    monthOutput.innerText = ageMonths;
    dayOutput.innerText = ageDays;
    // console.log(ageInYears, ageMonths, ageDays, daysOnEarth);
} */

const calculateAgeDays = (diffInDays) => {
    const ageInYears = Math.floor(diffInDays / 365.25);
    const remainderDays = diffInDays % 365.25
    const ageMonths = Math.floor(remainderDays / 30.44)
    const ageDays = Math.floor(remainderDays % 30.44)
    console.log(`years: ${ageInYears}, months: ${ageMonths}, days: ${ageDays}`)

    yearOutput.innerHTML = (ageInYears === 1) ? `<span class="num">${ageInYears}</span>year`: `<span class="num">${ageInYears}</span>years`
    monthOutput.innerHTML = (ageMonths === 1) ? `<span class="num">${ageMonths}</span>month`: `<span class="num">${ageMonths}</span>months`;
    dayOutput.innerHTML = (ageDays === 1) ? `<span class="num">${ageDays}</span>day`: `<span class="num">${ageDays}</span>days`;
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
        dateData[input.name] = parseInt(input.value); // this will get the value of day, month, year

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
        const diffInMs = dateToday - birthday
        const {currentYear, currentMonth, currentDay} = currentDateDate;
        const {day, month, year} = dateData // the user's birthday
        const diffInDays = differenceInCalendarDays(new Date(currentYear, currentMonth, currentDay), 
            new Date(year, month - 1, day));
        
        let daysInMonth = getDaysInMonth(new Date(year, month - 1))

        if (isExists(dateData.year, dateData.month - 1, dateData.day) 
            && isPast(new Date(dateData.year, dateData.month - 1, dateData.day))) {
                // calculateAgeMS(diffMS)
                calculateAgeDays(diffInDays)
                //handling user invalid inputs
                // if all the inputs are not valid
        } else if ((year > currentYear) && (day > daysInMonth) && (month < 1 || month > 12)) {
            hasError(inputFields[0], validationMessage.invalid.replace(':attribute', inputFields[0].name))
            hasError(inputFields[1], validationMessage.invalid.replace(':attribute', inputFields[1].name))
            hasError(inputFields[2], validationMessage.past);
            // if the month and year aren't valid
        } else if ((month < 1 || month > 12) && year > currentYear) {
            hasError(inputFields[1], validationMessage.invalid.replace(':attribute', inputFields[1].name))
            hasError(inputFields[2], validationMessage.past);
            // if day and year aren't valid
        }else if ((day > daysInMonth) && year > currentYear) {
            hasError(inputFields[0], validationMessage.invalid.replace(':attribute', inputFields[0].name))
            hasError(inputFields[2], validationMessage.past);
            // if the day and month aren't valid
        }else if ((day > daysInMonth) && (month < 1 || month > 12)) {
            hasError(inputFields[1], validationMessage.invalid.replace(':attribute', inputFields[1].name))
            hasError(inputFields[0], validationMessage.invalid.replace(':attribute', inputFields[0].name))
            // if the day isn't valid
        }else if (day > daysInMonth) {
            hasError(inputFields[0], validationMessage.invalid.replace(':attribute', inputFields[0].name))
            // if the month isn't valid
        } else if (month < 1 || month > 12) {
            hasError(inputFields[1], validationMessage.invalid.replace(':attribute', inputFields[1].name))
            // if the year isn't valid
        } else if (year > currentYear) {
            hasError(inputFields[2], validationMessage.past);
        }
        
    /*     if (birthday > dateToday) {
            if (dateData.year > currentYear) {
                hasError(inputFields[2], validationMessage.past)
            } else if (dateData.month > currentMonth) {
                hasError(inputFields[1], validationMessage.past);
            } else if (dateData.day > currentDay) {
                hasError(inputFields[0], validationMessage.past)
            }
        } else if (isNaN(birthday)) {
            console.log('not valid')
        } */

        // using the JDN algorithm had issues with the months jan and feb when calculating the age in years

        /* calculateAge(currentDay, currentMonth, currentYear, 
            parseInt(dateData.day), parseInt(dateData.month), parseInt(dateData.year)) */
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