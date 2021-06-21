//form elements
const titleElement = document.querySelector("h2")
const fieldsWrapperElement = document.querySelector(".form-fields")
const buttonElement = document.querySelector("#confirmBtn")
const messageElement = document.querySelector("#message")

//form data
const loginFormData = {
  title: "Login",
  fields: [
    { id: "email", type: "email", inputTitle: "E-mail" },
    { id: "pwd", type: "password", inputTitle: "Password" },
  ],
  message: `Don't have an account? <span id="link" onclick="switchForm(registerFormData)">Register</span>`,
  button: "Log in",
}
const registerFormData = {
  title: "Register",
  fields: [
    { id: "email", type: "email", inputTitle: "E-mail" },
    { id: "username", type: "text", inputTitle: "Username" },
    { id: "pwd", type: "password", inputTitle: "Password" },
    { id: "pwd2", type: "password", inputTitle: "Confirm password" },
  ],
  message: `Already have an account? <span id="link" onclick="switchForm(loginFormData)">Log in</span>`,
  button: "Register",
}

//error messages
const formErrors = {
  fieldRequired: "⚠ All fields are required.",
  invalidEmail: "⚠ Please enter a valid email.",
  takenUsername: "⚠ This username is already taken.",
  shortPassword: "⚠ Password should be at least 8 characters.",
  differentPassword: "⚠ Passwords do not match.",
}

const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const existingUsers = ["John", "Robert", "Marc"]

//### ON LOAD RENDER DEFAULT FORM(LOGIN FORM) ###
renderFormFields(loginFormData)

//### BTN EVENT ###
buttonElement.addEventListener("click", () => {
  if (validateForm()) {
    alert("Data in this form passes as valid. Check console log.")
    submitData()
  }
})

//### FUNCTIONS ###
function validateForm() {
  //declare all fields
  const emailField = document.querySelector("#email")
  const userField = document.querySelector("#username")
  const pwdField = document.querySelector("#pwd")
  const pwd2Field = document.querySelector("#pwd2")

  //check email pattern with regex
  if (emailField && !emailRegex.test(emailField.firstChild.value)) {
    throwError(emailField, formErrors.invalidEmail)
    return false
  }
  //check if user already exists
  if (userField) {
    if (existingUsers.includes(userField.firstChild.value)) {
      throwError(userField, formErrors.takenUsername)
      return false
    }
  }
  //check password length
  if (pwdField.firstChild.value.length < 8) {
    throwError(pwdField, formErrors.shortPassword)
    return false
  }
  //check password match
  if (pwd2Field && pwdField.firstChild.value !== pwd2Field.firstChild.value) {
    throwError(pwd2Field, formErrors.differentPassword)
    return false
  }
  //if all ok, return true
  return true
}

//### ### ###
function validateAsYouType(element) {
  //check email pattern with regex
  if (document.activeElement.parentElement.id === "email") {
    if (element.firstChild.value.length && !emailRegex.test(element.firstChild.value)) {
      showWarning(element, formErrors.invalidEmail)
      return
    }
  }
  //check username
  if (document.activeElement.parentElement.id === "username") {
    if (existingUsers.includes(element.firstChild.value)) {
      showWarning(element, formErrors.takenUsername)
      return
    }
  }
  //check password length
  if (document.activeElement.parentElement.id === "pwd") {
    if (element.firstChild.value.length && element.firstChild.value.length < 8) {
      showWarning(element, formErrors.shortPassword)
      return
    }
  }
  //check password match
  if (document.activeElement.parentElement.id === "pwd2") {
    if (
      element.firstChild.value.length &&
      element.firstChild.value !== document.querySelector("#pwd").firstChild.value
    ) {
      showWarning(element, formErrors.differentPassword)
      return
    }
  }
  //if field is valid
  hideWarning()
}

//### ### ###
function throwError(element, errorMessage) {
  element.classList.remove("warning")
  element.dataset.after = errorMessage
  element.firstChild.classList.add("error")
  element.firstChild.focus()
  setTimeout(() => {
    element.dataset.after = ""
    element.firstChild.classList.remove("error")
  }, 1900)
}

//### ### ###
function showWarning(element, errorMessage) {
  element.dataset.after = errorMessage
  element.classList.add("warning")
}

//### ### ###
function hideWarning() {
  ;[...document.querySelectorAll(".warning")].forEach((element) => {
    element.dataset.after = ""
    element.classList.remove("warning")
  })
}

//### ### ###
function submitData() {
  const data = {
    email: document.querySelector("#email").firstChild.value,
    username: document.querySelector("#username")
      ? document.querySelector("#username").firstChild.value
      : null,
    password: document.querySelector("#pwd").firstChild.value,
  }
  console.log(data)
}

//### ### ###
function switchForm(formObject) {
  clearFormFields()
  renderFormFields(formObject)
}

//### ### ###
function clearFormFields() {
  while (fieldsWrapperElement.firstChild) {
    fieldsWrapperElement.removeChild(fieldsWrapperElement.firstChild)
  }
}

//### ### ###
function renderFormFields(formObject) {
  titleElement.innerText = formObject.title
  messageElement.innerHTML = formObject.message
  buttonElement.value = formObject.button

  formObject.fields.forEach((field) => {
    //create div wrapper
    const inputWrapper = document.createElement("div")
    inputWrapper.id = field.id
    inputWrapper.classList.add("input-wrapper")
    inputWrapper.dataset.before = field.inputTitle
    const inputField = document.createElement("input")
    //create input field
    inputField.type = field.type
    inputWrapper.appendChild(inputField)
    fieldsWrapperElement.appendChild(inputWrapper)
    //set events for field
    inputField.addEventListener("keyup", () => validateAsYouType(inputWrapper))
  })
  //set focus on email field
  document.querySelector("#email").firstChild.focus()
}
