let notValid = ' is not a valid input!';
let range = {
    min: 3,
    max: 12
};

const isInt = (n) => {
    let isValid = false;
    if (n === Math.round(n)) {
        isValid = true;
    }
     return isValid;
};

const inRange = (n, min, max) => {
    let isValid = false;
    if (n >= min && n <= max) {
        isValid = true;
    }
    return isValid;
};

export const validInput = (n) => {
    let isValid = false;
    if (isInt(n) === true && inRange(n, range.min, range.max) == true) {
        isValid = true;
    } else {
      
        console.error(n + notValid)
    }
    return isValid;
    
};
