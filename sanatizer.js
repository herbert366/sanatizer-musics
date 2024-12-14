const fs = require('fs')
const path = require('path')

// Caminho da pasta onde estão os arquivos
const pasta = './musicas'

// Nome do prefixo para remover do título (ajuste conforme necessário)
const prefixoRemover = 'Ozeias De Paula'

// Função para capitalizar o título
const capitalizarTitulo = texto =>
  texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ')

// Função para limpar o título do arquivo
const limparTitulo = (nomeArquivo, artista) => {
  const regexes = [
    // Remover "01. Nome do Artista Título"
    new RegExp(`^\\d+\\.\\s${artista}\\s`, 'i'),
    // Remover apenas "03. Título"
    /^\d+\.\s/,
    // Remover extensão duplicada, como ".mp3.mp3"
    /\.mp3(\.mp3)+$/,
    // Remover "01 - Título"
    /^\d+\s-\s/,
    // Remover "Pr Eliezer Rosa Ao Vivo Título"
    new RegExp(`^${prefixoRemover}\\s`, 'i'),
    // Remover "11 Eliezer Rosa Título"
    new RegExp(`^\\d+\\s${artista}\\s`, 'i'),
    // Remover apenas o número inicial
    /^\d+\s/,
    // Remover "01- Título"
    /^\d+-\s/,
    // Remover "02 .Título"
    /^\d+\s\.\s*/,
    // Remover "07.peleja por jesus"
    /^\d+\.\s*/,
    // Remover ".Título" no início
    /^\.\s*/,
    // Remover "01-Título"
    /^\d+-/,
    // Remover "Mara Lima Lágrimas De Um Fiel 12 Título"
    /^[^\d]*\d+\s/,
    // Remover "Miscellaneous" no final
    /\s*Miscellaneous$/i,
    // Remover "(M4A_128K)" ou "(MP3_160K)" no final
    /\(.*?\)$/,
    // Remover "Artista + Número + . "
    /^[^\d]+\d+\.\s*/,
    // Remover "Número + Artista + Qualquer Texto Final"
    /^\d+\s[^\d]+\s.*?(?=\sVersão|\.mp3|$)/i,
    // Remover "Versão Estendida" ou textos similares
    /\sVersão.*$/i,
    // Remover o nome do artista no final
    new RegExp(`\\s${artista}$`, 'i'),
    // Remover "01 Nome do Artista - Título"
    /^\d+\s[^\-]+-\s/,

    // Remover "Artista - Título"
    /^[^\-]+-\s/,

    // Remover "- Título"
    /^-\s+/,
  ]

  let novoNome = nomeArquivo
  regexes.forEach(regex => {
    novoNome = novoNome.replace(regex, '').trim()
  })

  return capitalizarTitulo(novoNome)
}

// Renomear arquivos na pasta
fs.readdir(pasta, (err, arquivos) => {
  if (err) {
    console.error('Erro ao ler a pasta:', err)
    return
  }

  arquivos.forEach(arquivo => {
    const caminhoAntigo = path.join(pasta, arquivo)

    // Verifica se o arquivo é .mp3 ou .wav
    const extensao = path.extname(arquivo).toLowerCase()
    if (!['.mp3', '.wav'].includes(extensao)) {
      console.log(`Ignorado (não é MP3 ou WAV): ${arquivo}`)
      return
    }

    // Obtém o nome do arquivo sem a extensão
    const nomeBase = path.basename(arquivo, extensao)

    // Limpa o título
    const nomeLimpo = limparTitulo(nomeBase, prefixoRemover) + extensao

    const caminhoNovo = path.join(pasta, nomeLimpo)

    fs.rename(caminhoAntigo, caminhoNovo, err => {
      if (err) {
        console.error(`Erro ao renomear o arquivo ${arquivo}:`, err)
      } else {
        console.log(`Renomeado: ${arquivo} -> ${nomeLimpo}`)
      }
    })
  })
})
