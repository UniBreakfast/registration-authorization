const { readFile } = require('fs/promises')
const { createServer } = require('http')

const server = createServer(handleRequest)
const port = 3000

const router = {
  register: handleRegister,
  login: handleLogin,
  logout: handleLogout,
}

const users = []

const typeDictionary = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpg',
  ico: 'image/x-icon',
}

const hasSlashesRE = /\/|\\/

server.listen(port, notifyServerStarted)

async function handleRequest(request, response) {
  let { url } = request

  if (url === '/') url += 'index.html'

  console.log({url, method: request.method, users})

  if (url.startsWith('/api/')) {
    handleAPI(url.slice(5), request, response)
  } 
  else {
    try {
      await giveFile(url, response)
    } catch (error) {
      giveError(response)
    }
  }
}

function handleAPI(route, request, response) {
  const handler = router[route]

  if (handler) {
    handler(request, response)
  } else {
    giveApiError(response)
  }
}

async function giveFile(url, response) {
  const file = await readFile(`public${url}`)
  const type = getFileType(url)
  const contentType = typeDictionary[type]

  response.writeHead(200, { 'Content-Type': contentType })
  response.end(file)
}

async function handleRegister(request, response) {
  const body = await getBody(request)
  const user = JSON.parse(body)

  users.push(user)

  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('OK')
}

async function handleLogin(request, response) {
  const body = await getBody(request)
  const user = JSON.parse(body)

  const loggedUser = users.find(u => user.login == u.login && user.pass == u.pass)

  if (loggedUser) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('OK')
  } else {
    response.writeHead(401, { 'Content-Type': 'text/plain' })
    response.end('401: Wrong login or password')
  }
}

async function handleLogout(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('OK')
}

function getBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []

    request.on('data', chunk => chunks.push(chunk))
    request.on('end', () => resolve(Buffer.concat(chunks).toString()))
    request.on('error', reject)
  })
}

function giveError(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('404: File not found')
}

function giveApiError(response) {
  response.writeHead(400, { 'Content-Type': 'text/plain' })
  response.end('400: API error')
}

function getFileType(url) {
  const parts = url.split('.')
  const lastPart = parts.at(-1)

  if (lastPart.match(hasSlashesRE)) return ''

  return lastPart
}

function notifyServerStarted() {
  console.log(`Server started at http://localhost:${port}`)
}
