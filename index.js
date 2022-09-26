const { readFile } = require('fs/promises')
const { createServer } = require('http')

const server = createServer(handleRequest)
const port = 3000

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

  try {
    await giveFile(url, response)
  } catch {
    await giveError(response)
  }
}

async function giveFile(url, response) {
  const file = await readFile(`public${url}`)
  const type = getFileType(url)
  const contentType = typeDictionary[type]

  response.writeHead(200, { 'Content-Type': contentType })
  response.end(file)
}

function giveError(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('404: File not found')
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
