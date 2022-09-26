let loggedUser

regBtn.onclick = () => regDialog.showModal()
loginBtn.onclick = () => loginDialog.showModal()

logoutBtn.onclick = async () => {
  await requestLogout()
  userPanel.hidden = true
  guestPanel.hidden = false
}

regDialog.onclick = e => {
  if (e.target == regDialog) regDialog.close()
}

loginDialog.onclick = e => {
  if (e.target == loginDialog) loginDialog.close()
}

regForm.onsubmit = handleRegistation

loginForm.onsubmit = handleLogin

async function handleLogin() {
  const user = {
    login: loginForm.login.value,
    pass: loginForm.pass.value
  }

  loggedUser = await requestLogin(user)

  if (loggedUser) {
    loginDialog.close()
    loginForm.reset()
    guestPanel.hidden = true
    userPanel.hidden = false
    userLabel.innerText = user.login
  } else {
    alert('Wrong login or password!')
  }
}

async function requestLogin(user) {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  }

  const response = await fetch('/api/login', options)

  return response.ok ? user : null
}

async function handleRegistation() {
  const user = {
    login: regForm.login.value,
    pass: regForm.pass.value
  }

  await requestRegistration(user)
  regDialog.close()
  regForm.reset()
}

async function requestRegistration(user) {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  }

  const response = await fetch('/api/register', options)

  return response.ok ? user : null
}

async function requestLogout() {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(loggedUser)
  }

  const response = await fetch('/api/logout', options)

  return response.ok
}
