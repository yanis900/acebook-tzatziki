export const validatePassword = (password) => {
  if (password < 8) {
    throw new Error("Password Must Be Minimum 8 Characters");
  }
  if (password > 16) {
    throw new Error("Password Must Be Maximum 16 Characters");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password Must Contain At Least 1 Capital Letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password Must Contain At Least 1 Number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    throw new Error("Password Must Contain At Least 1 Special Character");
  }
};
