import { fs } from '../ipr/index.js'
const bufferReplaceRegex = /^data:image\/(png|jpg|jpeg);base64,/

function bufferPhoto(photo, author) {
  // generate a Buffer
  const buffer = Buffer.from(photo.replace(bufferReplaceRegex, ''), 'base64')
  // alot a random name
  const imagePath = `${Date.now()}-${author}.png`
  // save locally
  try {
    fs.writeFileSync(`storage/${imagePath}`, buffer)
  } catch (error) {
    return next(error)
  }
}

export default bufferPhoto
