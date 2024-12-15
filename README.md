# validator-js
A validator of data using javascript. This is a simple way to work with data validation without need to write a lot of code, you could only re-use your code and change the rules as you want of each data validation that you have in your code.

Also, You could test most of the functionalities here: https://johnrock16.github.io/validator-js
except create/modify custom validators (because they are javascript and not JSON) but this could be a great start to test the functionalities.

## How to start
To start is really simple you only need run this command:
```javascript
npm install
npm start
```

## Start the tests
You can run the tests using:
```javascript
npm test
```

## How everything works
If you didn't look the tests I recommend you start looking in the test first. To you get a better idea before continue.
Ok, so let's start by how you will put the code to validate the data that you want:

```javascript
const { myValidator } = require('./dataValidator/validators');
const { dataValidate } = require('./dataValidator/dataValidate');
const MY_RULES = require('./dataValidator/rules/validators/myValidatorRules.json');
const CONTACT_US = require('./dataValidator/rules/data/contactUs.json');
const MY_VALIDATION_ERROR_MESSAGES = require('./i18n/en_US/errors/myValidatorRules.json');

const fields = {
    "name": "John",
    "lastName": "Doe",
    "email": "email@email.com",
    "emailConfirm": "email@email.com",
    "phone": "",
    "subject": "I need a coffe",
    "message": "Give me coffe"
}

// this should returns {ok: true}
const dataValidatedCorrectly = dataValidate(fields, {validationHelpers: myValidator, rules: MY_RULES, dataRule: CONTACT_US, dataErrorMessages: MY_VALIDATION_ERROR_MESSAGES});
```

You will need to instantiate dataValidate and pass this parameters:
- **field**: The object you wants to validate
- **validationHelpers**: The functions that you write to help your validate your field data (see examples/vanilla/src/dataValidator/validator.js)
- **rules**: The general rules that you have in your project. This determines what is expected to do for each situation (see examples/vanilla/src/dataValidator/rules/myValidatorRules.json)
- **dataRule**: This will map the connections between your fields and rules, this should be your specific "form rules" to validate all the data inside fields. (see examples/vanilla/src/dataValidator/rules/data/contactUs.json)
- **dataErrorMessages**: A JSON with your error messages. (see examples/vanilla/i18n/en_US/errors/myValidatorRules.json)

So in this case We have some **fields** to validate, your specific rule for what "general rules" We will use and what field would be required or not will be inside **dataRule**, this will be a bridge between **fields** and **rules** which will determines the approach to be validated and what fields needs to be validate using a specific funcion inside **validationHelpers** if some of this **rules** are broken by some **field data** We will return an error and a custom error message defined in **rules** and **dataErrorMessages**.

### Data rules
This will be your specific rule for each **data** you need to validate. Here is an example using a **contact us** structure to be validated:
```json
{
    "name": {
        "rule": "name",
        "required": true
    },
    "lastName": {
        "rule": "name",
        "required": true
    },
    "email": {
        "rule": "email",
        "required": true
    },
    "emailConfirm": {
        "rule": "email--confirm",
        "required": true
    },
    "phone": {
        "rule": "phone",
        "required": false
    },
    "subject": {
        "rule": "hasText",
        "required": true
    },
    "message": {
        "rule": "hasText",
        "required": true
    }
}

```
In this case We will determines what rule will be used for each **data** We will validate and if this **data** would be required or not. So you could create a lot of this **data rules** for each situation that you found in your application if you need validate some data for **contact us** or **customer register** or **support form** you could and will need create an **data rule** for each of this situations.

### Rules
This rules have a more general scope, and will determines what to do and what needs to be validate when this rule will be used and if this rule for some reason was broken by the **data** during the validation. This rules will determines what is the error We should return in this case. Here is a small example of rules:

```json
{
  "name": {
    "validate": ["hasText"],
    "error": {
        "hasText": "common.hasText"
    }
  },
  "email":{
    "regex": "/^[a-z0-9.]+@[a-z0-9]+\\.[a-z]+(\\.[a-z]+)?$/i",
    "validate": ["regex"],
    "error": {
      "regex": "email.regex"
    },
    "modifier": {
      "confirm": {
        "validate": ["regex", "equals"],
          "params": {
            "equals": ["$email"]
          },
          "error": {
            "regex": "email.regex",
            "equals": "email.equals"
          }
      }
    }
  },
  "date": {
    "regex": "/^\\d{4}[\/\\-](0?[1-9]|1[012])[\/\\-](0?[1-9]|[12][0-9]|3[01])$/",
    "validate": ["regex", "validDate"],
    "error": {
        "regex": "common.dateFormat",
        "validDate": "date.validDate"
    },
    "modifier": {
      "age": {
        "validate": ["regex", "validateAge"],
        "params": {
            "validateAge": [18, 130]
        },
        "error": {
            "regex": "common.dateFormat",
            "validateAge": "date.modifier.age.validateAge"
        }
      }
    }
  }
}
```

In this case the name of rule will be the keys of the JSON and the will have this data:

- **validate**: an array of functions which will be running to validate the rule (these functions are the functions inside **validationHelpers**)
- **error**: The error that should be returned during of the fail of some of the functions inside **validate**.
- **regex**: The regex need for some regex validation during **validate**.
- **modifier**: An rule that will inherit some of properties of original rule and override
- **params**: The parameters that should be used in some functions during **validate** (Also you could add variables, the data fields ones in parameters following this structure $variable so if you want access the email variable you could use something like this: $email)

Also, you could create more than one **rules file** for your application, the structure will not forces you to have only one **rules file** for entire application.

### ValidationHelpers
The functions that will help you validate your **data** this functions are mentioned in **rules** and have this structure:

```javascript
const { regexStringToExpression, isValidDate, calculateAge, validateCPF } = require("./util");

const myValidator = function (value, rule, modifier = null) {
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

    return({
        regex,
        hasText,
        maxLength,
        validDate,
        validateAge,
        cpf
    })
}
```

All functions inside your **validatorHelper** could be anything and also using functions of another places such as **utils** to help your validate, the only rule you need to respect is all rules inside of your **validatorHelper** needs to be mentioned with the same name in **rules** and also always returns a **boolean**. Also, you could be create more than one **validatorHelper** to use in your application.

### Error Messages
This is an way to have error messages for each situation. You only need to respect the path of error message following the error structure in **rules**.

```json
{
  "common": {
    "hasText": "Please, fill the field"
  },
  "email": {
    "regex": "Please, fill the field with a valid e-mail"
  },
  "phone": {
    "regex": "Please, fill the field with a valid phone"
  }
}
```

### Test
We have a lot of examples in __tests__ folder and I recommend to you see these examples and try to create some tests to see how everything works and try to create another scenario instead **contact us** or **customer creation**.
