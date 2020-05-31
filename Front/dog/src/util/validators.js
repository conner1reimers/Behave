const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_NUMBER = 'NUMBER';
const VALIDATOR_TYPE_NONE = 'NONE';



export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE})
export const VALIDATOR_NONE = () => ({ type: VALIDATOR_TYPE_NONE})

export const VALIDATOR_MINLENGTH = (val) => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    val: val
});
export const VALIDATOR_MAXLENGTH = (val) => ({
    type: VALIDATOR_TYPE_MAXLENGTH,
    val: val
});
export const VALIDATOR_EMAIL = () => ({type: VALIDATOR_TYPE_EMAIL})

export const VALIDATOR_NUMBER = (val) => ({
    type: VALIDATOR_TYPE_NUMBER,
    val: val
});

export const validate = (value, validation) => {
    let isValid = true;

    if (validation.type === VALIDATOR_TYPE_REQUIRE) {
        isValid = isValid && value.trim().length > 0;
    }
    if (validation.type === VALIDATOR_TYPE_MINLENGTH) {
        isValid = isValid && value.trim().length >= validation.val;
    }
    if (validation.type === VALIDATOR_TYPE_MAXLENGTH) {
        isValid = isValid && value.trim().length <= validation.val;
    }
    if (validation.type === VALIDATOR_TYPE_EMAIL) {
        isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validation.type === VALIDATOR_TYPE_NUMBER) {
        isValid = isValid && /^[0-9]*$/.test(value)
    }
    if (validation.type === VALIDATOR_TYPE_NONE) {
        isValid = isValid
    }

    return isValid;
}