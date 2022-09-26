const users = []
let loggedUser

regBtn.onclick = () => regDialog.showModal()
loginBtn.onclick = () => loginDialog.showModal()

logoutBtn.onclick = () => {
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

function handleLogin() {
  const user = {
    login: loginForm.login.value,
    pass: loginForm.pass.value
  }

  loggedUser = users.find(u => user.login == u.login && user.pass == u.pass)

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

function handleRegistation() {
  const user = {
    login: regForm.login.value,
    pass: regForm.pass.value
  }

  users.push(user)
  regDialog.close()
  regForm.reset()
}
