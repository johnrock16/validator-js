// src/js/dataValidate.js
function dataValidate(data, { validationHelpers = {}, rules, dataRule, dataErrorMessages = {} }) {
  const dataErrors = {};
  function getObjectValueByPath(obj, path) {
    if (!obj || typeof path !== "string") return void 0;
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current[key] === void 0) return void 0;
      current = current[key];
    }
    return current;
  }
  function inputValidation(dataAttribute, data2 = null) {
    const { rule, required } = dataRule[dataAttribute.key];
    if (rule && required || !required && dataAttribute.value != "") {
      if (rule) {
        const INPUT_RULE = rule.split("--")[0];
        const RULE_MODIFIER = rule.split("--").length > 1 ? rule.split("--")[1] : "";
        const dataAttributeValidation = dataAttributeValidator(dataAttribute.value, rules[INPUT_RULE], RULE_MODIFIER, validationHelpers, data2);
        const { isValid, errorMessage, errorType } = dataAttributeValidation.validate();
        if (!isValid) {
          dataErrors[dataAttribute.key] = {
            name: dataAttribute.key,
            error: true,
            errorMessage: getObjectValueByPath(dataErrorMessages, errorMessage) || errorMessage,
            errorType
          };
        }
        return isValid;
      }
    }
    return true;
  }
  function validate() {
    let dataArr = Object.keys(data).map((key) => ({ key, value: data[key] }));
    if (dataArr && dataArr.length > 0) {
      if (!Object.keys(dataRule).every((key) => data.hasOwnProperty(key))) {
        return { error: true, errorMessage: "Missing properties" };
      }
      const dataValidators = [...dataArr].map((input) => inputValidation(input, data));
      if (dataValidators.some((element) => !element)) {
        return { error: true, dataErrors };
      }
      const dataRuleArr = Object.keys(dataRule).map((key) => ({ key, required: dataRule[key].required }));
      const dataAttributesKey = dataArr.map((attribute) => attribute.key);
      const dataAttributesRequired = dataRuleArr.filter((rule) => rule.required).map((rule) => rule.key);
      if (!dataAttributesRequired.every((fieldRequired) => dataAttributesKey.includes(fieldRequired))) {
        return { error: true };
      }
    } else if (!dataArr || dataArr.length === 0) {
      return { error: true, errorMessage: "Missing fields for dataRules" };
    }
    return { ok: true };
  }
  return validate();
}
function dataAttributeValidator(value, rule, modifier = null, customValidation = null, data = null) {
  function validateRules(rule2) {
    let errorMessage;
    let errorType;
    const isValid = !rule2.validate.some((validation) => {
      let isInvalid = true;
      if (rule2.params && rule2.params[validation] && rule2.params[validation].length > 0) {
        const params = rule2.params[validation].map((param) => typeof param === "string" && param[0] === "$" ? param.substring(1, param.length) : param);
        isInvalid = !this[validation](...params);
      } else {
        isInvalid = !this[validation]();
      }
      if (isInvalid && !errorMessage && rule2?.error[validation]) {
        errorMessage = rule2.error[validation];
        errorType = validation;
      }
      return isInvalid;
    });
    return { isValid, errorMessage, errorType };
  }
  function validate() {
    if (customValidation && typeof customValidation === "function") {
      const validation = customValidation(value, rule, modifier, data);
      Object.keys(validation).forEach((key) => {
        this[key] = validation[key];
      });
    }
    return modifier ? validateRules.call(this, rule.modifier[modifier]) : validateRules.call(this, rule);
  }
  return {
    validate
  };
}

// src/main.js
var main_default = {
  dataValidate
};
export {
  main_default as default
};
