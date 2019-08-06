const fs = require('fs')
const xml2js = require('xml2js')

fs.readdir('./results', (err, files) => {
  files.map(name => {
    fs.readFile(`./results/${name}`, (err, data) => {
      const json = JSON.parse(data)
      const builder = new xml2js.Builder()
      const xml = builder.buildObject(json)
      fs.writeFile(`./translated/${name.replace('.json', '.xml')}`, xml, () => {
        console.log('complete', `./translated/${name.replace('.json', '.xml')}`)
      })
    })
  })
})

