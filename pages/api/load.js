import fs from 'fs'

export default (req, res) => {
  const { file } = req.query

  import(`./../../results/${file}.json`)
    .then(data => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify({ list: data.STBLKeyStringList.Text }))
    })
    .catch(err => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 500
      res.end(JSON.stringify({ err }))
    })
}
