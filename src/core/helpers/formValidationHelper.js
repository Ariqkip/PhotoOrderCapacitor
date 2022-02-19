const isText = RegExp(/^[A-Z ]+$/i);
const isEmail = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const isPhoneGeneral = RegExp(/^[\d ()+]+$/);
const isNumber = RegExp(/^\d+$/);

export default function formValidationHelper(name, value, schema) {
  const { validate, minLength, maxLength } = schema[name];
  let error = '';

  if (minLength && value.length < minLength)
    error = `Minimum ${minLength} characters is required.`;
  else if (maxLength && value.length > maxLength)
    error = `Maximum length of ${maxLength} exceeded!`;
  if (!validate) return error;

  switch (validate) {
    case 'text':
      if (!isText.test(value)) error = 'This field accept text only.';
      break;

    case 'number':
      if (!isNumber.test(value)) error = 'This field accept numbers only.';
      break;

    case 'email':
      if (!isEmail.test(value)) error = 'Please enter a valid email';
      break;

    case 'phone':
      if (!isPhoneGeneral.test(value))
        error = 'Please enter a valid phone number. i.e: +XXXXXXXXXX';
      break;

    default:
      break;
  }

  return error;
}
