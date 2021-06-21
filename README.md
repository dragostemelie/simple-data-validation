## DATA VALIDATION CONCEPT WITH VANILLA JAVASCRIPT

A live demo of this can be found on [CodePen](https://codepen.io/dragostemelie/pen/KKWxwJo).

The structure of **index.html** is fairly basic. Inside the body we have a `<main>` tag with this simple structure:

```html
<main>
  <div class="form-container">
    <h2></h2>
    <div class="form-fields"></div>
    <div class="input-wrapper btn">
      <input id="confirmBtn" type="button" value="Log in" />
    </div>
    <p id="message"></p>
  </div>
</main>
```

- `h2` holds the form title,
- `.form-fiels` is a wrapper for the rendered fields,
- `p` contains the switch message(between login and register).

The pseudo-elements `:before` and `:after` are used to display the field title and the error message. Each field will look like this:

![Input](https://dragostemelie.go.ro/projects/simple-data-validation/img/input-field.JPG)

Each input is wraped inside of a div block. The attributes `data-before` and `data-after` hold the values for the field title and error message. For the above picture, the rendered field looks like this:

```html
<div
  id="email"
  class="input-wrapper"
  data-before="E-mail"
  data-after="⚠ Please enter a valid email."
>
  <input type="email" />
</div>
```

The context of `::before` and `::after` pseudo-elements are set by using the `attr()` css function:

```css
.input-wrapper::before {
  content: attr(data-before);
  ...;
}
```

That's the core part of html and css. Simple, right?

Now we can move to the javascript part. Create the file `script.js` and ...

At the beginning of **script.js** file the form data model and error messages are defined:

```js
//html elements
const titleElement = document.querySelector("h2")
const fieldsWrapperElement = document.querySelector(".form-fields")
const buttonElement = document.querySelector("#confirmBtn")
const messageElement = document.querySelector("#message")

//form login object
const loginFormData = {
  title: "Login",
  fields: [
    { id: "email", type: "email", inputTitle: "E-mail" },
    { id: "pwd", type: "password", inputTitle: "Password" },
  ],
  message: `Don't have an account? <span id="link" onclick="switchForm(this.innerText)">Register</span>`,
  button: "Log in",
}

//form register object
const registerFormData = {
  title: "Register",
  fields: [
    { id: "email", type: "email", inputTitle: "E-mail" },
    { id: "username", type: "text", inputTitle: "Username" },
    { id: "pwd", type: "password", inputTitle: "Password" },
    { id: "pwd2", type: "password", inputTitle: "Confirm password" },
  ],
  message: `Already have an account? <span id="link" onclick="switchForm()">Log in</span>`,
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
```

Email field validation is done using a regular expression(regex). The one used in this project is fairly modest, but good enough:

```js
const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
```

The function to render the form fields inside **index.html** gets a `formObject` parameter to know the type of form to render(**loginFormData** or **registerFormData**):

```js
//render form data
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
    //create input field
    const inputField = document.createElement("input")
    inputField.type = field.type
    inputWrapper.appendChild(inputField)
    fieldsWrapperElement.appendChild(inputWrapper)
    //set events for field
    inputField.addEventListener("keyup", () => validateAsYouType(inputWrapper))
  })
  //set focus on email field
  document.querySelector("#email").firstChild.focus()
}
```
