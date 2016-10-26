#!/usr/bin/env node

const args = require('args')
const fs = require('fs')
const http = require('http')

args
  .option('maxwidth', 'The max width of the embedded tweet. 220-550 inclusive.')
  .option('media', 'Expand photo and video previews')
  .option('input', 'Path to a JSON file with a top-level "tweets ' +
          'object which is an array of objects with username and id keys')
  .option('thread', 'Expand tweet threads')
  .option('script', 'Include the script that loads Twitter\'s widget.js')
  .option('align', 'Float value for the embedded tweet.')

const flags = args.parse(process.argv)

let tweets

validateOptions()

function validateOptions () {
  if (!flags.input) {
    console.error('Provide an input file')
    process.exit()
  } else if (flags.maxwidth && (flags.maxwidth < 220 || flags.maxwidth > 550)) {
    console.error('maxwidth must be in range 220-550')
    process.exit()
  } else if (flags.align && !['center', 'right', 'none'].contains(flags.align)) {
    console.error('invalid value for align option')
    process.exit()
  }

  // Read the input file
  try {
    const f = fs.readFileSync(flags.input)
    tweets = JSON.parse(f).tweets
  } catch (err) {
    console.error(`Couldn't read ${flags.input}`)
    process.exit()
  }
}

function constructRequestURL (id, username, align, maxWidth, thread, media, script) {
  const base = 'https://publish.twitter.com/oembed?'
  const url = `url=https://twitter.com/${username}/status/${id}`
  const hideThread = `&hide_thread=${!thread}`
  const hideMedia = `&hide_media=${!media}`
  const omitScript = `&omit_script=${!script}`
  const maxwidth = `&maxwidth=${maxWidth || 400}`

  return `${base}${url}${hideThread}${hideMedia}${omitScript}${maxwidth}`
}

function executeRequest (url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const contentType = res.headers['content-type']

      if (res.statusCode !== 200) {
        reject(new Error(`Request Failed\nStatus Code: ${res.statusCode}`))
      } else if (!/^application\/json/.test(contentType)) {
        reject(new Error(`Inavlid content type.\nExpected` +
                         ` application/json but received ${contentType}`))
      }

      res.setEncoding('utf8')

      let data = ''

      res.on('data', (chunk) => { data += chunk })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed)
        } catch (err) {
          reject(err.message)
        }
      })
    })
  })
}
