const { myValidator } = require('./dataValidator/validators');
const { dataValidate } = require('./dataValidator/dataValidate');
const MY_RULES = require('./dataValidator/rules/validators/myValidatorRules.json');
const CONTACT_US = require('./dataValidator/rules/data/contactUs.json');
const MY_VALIDATION_ERROR_MESSAGES = require('./i18n/en_US/errors/myValidatorRules.json');

const fieldsWorking = {
    "name": "John",
    "lastName": "Doe",
    "email": "email@email.com",
    "phone": "",
    "subject": "I need a coffe",
    "message": "Give me coffe"
}

const fieldsNotWorking = {
    "name": "",
    "lastName": "",
    "email": "",
    "phone": "0000-0000",
    "subject": "",
    "message": ""
}

const dataValidatedWrong = dataValidate(fieldsNotWorking, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US, dataErrorMessages: MY_VALIDATION_ERROR_MESSAGES});
const dataValidatedWrongWIthoutErrorMessage = dataValidate(fieldsNotWorking, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
const dataValidatedCorrectly = dataValidate(fieldsWorking, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US, dataErrorMessages: MY_VALIDATION_ERROR_MESSAGES});

console.log(dataValidatedWrong);
console.log(dataValidatedWrongWIthoutErrorMessage);
console.log(dataValidatedCorrectly);
