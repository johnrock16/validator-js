const { myValidator, nameValidator } = require('./dataValidator/validators');
const { dataValidate } = require('./dataValidator/dataValidate');
const MY_RULES = require('./dataValidator/rules/validators/myValidatorRules.json');
const NAME_RULE = require('./dataValidator/rules/validators/name.rule.json');
const CONTACT_US = require('./dataValidator/rules/data/contactUs.json');
const NAME_DATA_RULE = require('./dataValidator/rules/data/name.data.rule.json');
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


// example using different validators, rules and data rules and also using variables in this validation (see variable usages in data-rules, rules and validators)

const RULEs = {...MY_RULES, ...NAME_RULE};
const DATA_RULES = {...CONTACT_US, ...NAME_DATA_RULE}
const validatorHelpers = (value, rule, modifier = null, data = null) => ({
    ...myValidator(value, rule, modifier, data),
    ...nameValidator(value, rule, modifier, data)
});

const fieldsWorking2 = {
    "name": "John",
    "lastName": "Doe",
    "email": "email@email.com",
    "phone": "",
    "subject": "I need a coffe",
    "message": "Give me coffe",
    "cellphone": "0000-0000"
}

const dataValidatedCorrectlyWithInheritanceAndVariables = dataValidate(fieldsWorking2, {validationHelpers: validatorHelpers, rules: RULEs, dataRule: DATA_RULES, dataErrorMessages: MY_VALIDATION_ERROR_MESSAGES});

console.log(dataValidatedCorrectlyWithInheritanceAndVariables)
