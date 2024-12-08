const { myValidator } = require('../dataValidator/validators');
const { dataValidate } = require('../dataValidator/dataValidate');
const MY_RULES = require('../dataValidator/rules/validators/myValidatorRules.json');
const CONTACT_US = require('../dataValidator/rules/data/contactUs.json');
const CUSTOMER_CREATION = require('../dataValidator/rules/data/customerCreation.json');
const MY_VALIDATOR_ERROR_MESSAGES = require('../i18n/en_US/errors/myValidatorRules.json');

describe('dataValidator', () => {
    describe('contact us', () => {
        describe('happy ending', () => {
            test('filled all fields correctly', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US, dataErrorMessages: MY_VALIDATOR_ERROR_MESSAGES});
                expect(dataValidated.ok).toBeTruthy();
            });


            test('filled all fields correctly without error messages translated in parameters', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.ok).toBeTruthy();
            });

            test('filled with required only', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.ok).toBeTruthy();
            });
        });

        describe('bad ending', () => {
            test('missing all properties', () => {
                const fieldsMissing = {}
                const dataValidated = dataValidate(fieldsMissing, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.errorMessage).toBe("Missing fields for dataRules");
            });

            test('missing one properties', () => {
                const fieldsFilledWrong = {
                    "lastName": "",
                    "email": "emailcom",
                    "phone": "0-0000",
                    "subject": "",
                    "message": ""
                }
                const dataValidated = dataValidate(fieldsFilledWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.errorMessage).toBe("Missing properties");
            });

            test('missing some properties', () => {
                const fieldsFilledWrong = {
                    "lastName": "",
                    "email": "emailcom",
                }
                const dataValidated = dataValidate(fieldsFilledWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.errorMessage).toBe("Missing properties");
            });

            test('filled wrong with error messages', () => {
                const fieldsFilledWrong = {
                    "name": "",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US, dataErrorMessages: MY_VALIDATOR_ERROR_MESSAGES});
                expect(dataValidated.dataErrors.name.errorMessage).toBe("Please, fill the field");
            });

            test('filled wrong without error messages', () => {
                const fieldsFilledWrong = {
                    "name": "",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.name.errorMessage).toBe("common.hasText");
            });

            test('filled all fields wrong', () => {
                const fieldsFilledWrong = {
                    "name": "",
                    "lastName": "",
                    "email": "emailcom",
                    "phone": "0-0000",
                    "subject": "",
                    "message": ""
                }
                const dataValidated = dataValidate(fieldsFilledWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(Object.keys(dataValidated.dataErrors).length).toBe(6);
            });

            test('filled name wrong', () => {
                const fieldsFilledNameWrong = {
                    "name": "",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledNameWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.name.name).toBe('name');
            });

            test('filled last name wrong', () => {
                const fieldsFilledNameWrong = {
                    "name": "John",
                    "lastName": "",
                    "email": "email@email.com",
                    "phone": "",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledNameWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.lastName.name).toBe('lastName');
            });

            test('filled email wrong', () => {
                const fieldsFilledNameWrong = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "emailcom",
                    "phone": "",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledNameWrong, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.email.name).toBe('email');
            });

            test('filled phone wrong', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "000",
                    "subject": "I need a coffe",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.phone.name).toBe('phone');
            });

            test('filled subject wrong', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "",
                    "message": "Give me coffe"
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.subject.name).toBe('subject');
            });

            test('filled message wrong', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                    "subject": "I need a coffe",
                    "message": ""
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US});
                expect(dataValidated.dataErrors.message.name).toBe('message');
            });
        });
    });

    describe('customer creation', () => {
        const myValidatorMocked = (value, rule, modifier = null) => ({
            ...myValidator(value, rule, modifier),
            cpf: () => value === '000.000.000-00' // I don't want to be sued by putting a random CPF in the code
        });

        describe('happy ending', () => {
            test('filled all fields correctly', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "birthdate": "2000-12-22",
                    "cpf": "000.000.000-00",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION, dataErrorMessages: MY_VALIDATOR_ERROR_MESSAGES});
                expect(dataValidated.ok).toBeTruthy();
            });

            test('filled all fields correctly without error messages translated in parameters', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "birthdate": "2000-12-22",
                    "cpf": "000.000.000-00",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                console.log(myValidatorMocked())
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION});
                expect(dataValidated.ok).toBeTruthy();
            });

            test('filled all fields expect optionals', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "",
                    "birthdate": "2000-12-22",
                    "cpf": "000.000.000-00",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION, dataErrorMessages: MY_VALIDATOR_ERROR_MESSAGES});
                expect(dataValidated.ok).toBeTruthy();
            });
        });

        describe('bad ending', () => {
            test('filled cpf wrong', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "birthdate": "2000-12-22",
                    "cpf": "000.000.000-01",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION});
                expect(dataValidated.dataErrors.cpf.name).toBe('cpf');
            });

            test('filled birthdate invalid regex', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "birthdate": "2000-12-42",
                    "cpf": "000.000.000-00",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION});
                expect(dataValidated.dataErrors.birthdate.errorType).toBe('regex');
            });

            test('filled birthdate invalid age (under 18)', () => {
                const fieldsFilledCorrectly = {
                    "name": "John",
                    "lastName": "Doe",
                    "birthdate": "2024-12-01",
                    "cpf": "000.000.000-00",
                    "email": "email@email.com",
                    "phone": "0000-0000",
                }
                const dataValidated = dataValidate(fieldsFilledCorrectly, {validationHelpers: myValidatorMocked, rules: MY_RULES, dataRule: CUSTOMER_CREATION});
                expect(dataValidated.dataErrors.birthdate.errorType).toBe('validateAge');
            });
        });
    });
});
