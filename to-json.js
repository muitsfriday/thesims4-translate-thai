const fs = require('fs')
const parseString = require('xml2js').parseString

fs.readdir('./resources', (err, files) => {
  files.map(name => {
    fs.readFile(`./resources/${name}`, (err, data) => {
      parseString(data, (err, res) => {
        fs.writeFile(`./results/${name.replace('.xml', '.json')}`, JSON.stringify(res, null, 2), () => {
          console.log('write complete', `./result/${name.replace('.xml', '.json')}`)
        })
      })
    })
  })
})

