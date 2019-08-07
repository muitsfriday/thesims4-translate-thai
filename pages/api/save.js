import fs from 'fs'
import path from 'path'

export default (req, res) => {
  const { file } = req.query
  const body = req.body

  fs.writeFile(
    `results/${file}.json`,
    JSON.stringify(
      {
        STBLKeyStringList: {
          Text: (body || { list: [] }).list
        }
      },
      null,
      2
    ),
    (err, a) => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify({ a: 1 }))
    }
  )
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
}
