const fs = require('fs')
const path = require('path')

// Caminho da pasta onde estão os arquivos
const pasta = './musicas'

// Função para adicionar extensão ".mp3" aos arquivos sem extensão
const adicionarExtensaoMp3 = () => {
  fs.readdir(pasta, (err, arquivos) => {
    if (err) {
      console.error('Erro ao ler a pasta:', err)
      return
    }

    arquivos.forEach(arquivo => {
      const caminhoAntigo = path.join(pasta, arquivo)

      // Verifica se o arquivo não tem extensão
      if (!path.extname(arquivo)) {
        const novoNome = `${arquivo}.mp3`
        const caminhoNovo = path.join(pasta, novoNome)

        fs.rename(caminhoAntigo, caminhoNovo, err => {
          if (err) {
            console.error(`Erro ao renomear o arquivo ${arquivo}:`, err)
          } else {
            console.log(`Renomeado: ${arquivo} -> ${novoNome}`)
          }
        })
      }
    })
  })
}

// Executar a função separadamente
adicionarExtensaoMp3()
