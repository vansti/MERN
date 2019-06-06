const Validator = require('validator');
const isEmpty = require('./is-empty');
const isPhone =  require('is-phone')

module.exports = function validateAddStudentInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Họ Tên phải ít nhất 2 ký tự';
  }

  if (!isPhone(data.phone)) {
    errors.phone = 'Số điện thoại không đúng';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Họ Tên không được bỏ trống';
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = 'Hãy chọn chức danh';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email không được bỏ trống';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password không được bỏ trống';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password phải ít nhất 6 ký tự';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Password xác nhận không được bỏ trống';
  } else {
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = 'Password xác nhận không chính xác';
    }
  }

  if (Validator.isEmpty(data.recipient_name)) {
    errors.recipient_name = 'Hãy điền tên người thanhh toán';
  }

  if (Validator.isEmpty(data.email2)) {
    errors.email2 = 'Hãy điền email người thanhh toán';
  }

  if (Validator.isEmpty(data.line1)) {
    errors.line1 = 'Hãy điền địa chỉ';
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = 'Hãy điền thành phố';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};