const { regexStringToExpression, isValidDate, calculateAge, validateCPF } = require("./util");

const myValidator = function (value, rule, modifier = null, data = null) {
    function regex() {
        const regexTemplate = (rule.modifier && rule.modifier[modifier]?.regex) ? rule.modifier[modifier].regex : rule.regex;
        const regexExpression = typeof regexTemplate === 'string' ? regexStringToExpression(regexTemplate) : regexTemplate;
        return regexExpression.test(value);
    }

    function hasText() {
        return value.replace(/\s/g, '').length > 0;
    }

    function maxLength(maxValue) {
        return maxValue >= value.length;
    }

    function validDate() {
        return isValidDate(value);
    }

    function validateAge(minAge, maxAge) {
        const age = calculateAge(value);
        return age >= minAge && age <= maxAge;
    }

    function cpf() {
        return validateCPF(value);
    }

    function equals(key) {
        console.log('aqui', data)
        return value === data[key];
    }

    return({
        regex,
        hasText,
        maxLength,
        validDate,
        validateAge,
        cpf,
        equals
    })
}

const nameValidator = function (value, rule, modifier = null, data = null) {
    function nameSpecialValidation(emailKey, cellphoneKey) {
        return !!(value && data[emailKey] && data[cellphoneKey])
    }

    return({
        nameSpecialValidation
    })
}

module.exports = {
    myValidator,
    nameValidator
}
