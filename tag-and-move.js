const fs = require('fs')
const path = require('path')

// Pasta raiz para buscar os arquivos e a pasta de destino
const ROOT_FOLDER = '../'
const DEST_FOLDER = '../Songs'

// Função para criar a pasta DEST_FOLDER, caso não exista
if (!fs.existsSync(DEST_FOLDER)) {
  fs.mkdirSync(DEST_FOLDER)
}

// Função para processar arquivos em pastas e subpastas
function processFolders(folderPath) {
  const items = fs.readdirSync(folderPath)

  for (const item of items) {
    const itemPath = path.join(folderPath, item)
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      // Se for uma pasta, percorra ela
      processFolders(itemPath)
    } else if (stats.isFile() && path.extname(item) === '.mp3') {
      // Renomear arquivos .mp3
      const parentFolderName = path.basename(folderPath)
      const newFileName = `${path.basename(
        item,
        '.mp3'
      )} - ${parentFolderName}.mp3`
      const newFilePath = path.join(DEST_FOLDER, newFileName)

      // Move e renomeia o arquivo
      fs.renameSync(itemPath, newFilePath)
      console.log(`Arquivo movido: ${newFilePath}`)
    }
  }
}

// Inicia o processamento a partir da pasta raiz, mas ignora a pasta ./SONGS
fs.readdirSync(ROOT_FOLDER).forEach(folder => {
  const folderPath = path.join(ROOT_FOLDER, folder)

  if (folder !== 'Songs' && fs.statSync(folderPath).isDirectory()) {
    processFolders(folderPath)
  }
})

console.log('Processamento concluído.')
