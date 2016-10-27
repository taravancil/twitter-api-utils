#!/usr/bin/env node

const args = require('args')
const fs = require('fs')
const https = require('https')

args
  .option('maxwidth', 'The max width of the embedded tweet. 220-550 inclusive.')
  .option('media', 'Expand photo and video previews')
  .option('input', 'Path to a JSON file with a top-level "tweets ' +
          'object which is an array of objects with username and id keys')
  .option('output', 'The path to write the output to')
  .option('thread', 'Expand tweet threads')
  .option('script', 'Include the script that loads Twitter\'s widget.js')
  .option('align', 'Float value for the embedded tweet.')

const flags = args.parse(process.argv)

let tweets

validateOptions()
getEmbedHTML()

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
  const url = encodeURIComponent(`https://twitter.com/${username}/status/`)
  const hideThread = `&hide_thread=${!thread}`
  const hideMedia = `&hide_media=${!media}`
  const omitScript = `&omit_script=${!script}`
  const maxwidth = `&maxwidth=${maxWidth || 400}`

  return `${base}url=${url}${id}${hideThread}${hideMedia}${omitScript}${maxwidth}`
}

function executeRequest (url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function getEmbedHTML () {
  let output = {tweets: []}

  const {maxwidth, align, media, thread, script} = flags

  console.log('Fetching...')

  for (tweet of tweets) {
    const {id, username} = tweet

    let req = constructRequestURL(id, username, align, maxwidth, thread, media, script)

    try {
      const res = await executeRequest(req)
      output.tweets.push({id: id, html: res.html, translated: false})
    } catch (err) {
      console.error(err)
      process.exit()
    }
  }

  if (flags.output) {
    fs.writeFileSync(flags.output, JSON.stringify(output), 'utf8')
    console.log(`Wrote output to ${flags.output}`)
  } else {
    console.log(output)
  }
}
