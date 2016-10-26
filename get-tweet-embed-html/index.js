#!/usr/bin/env node

const args = require('args')

args
  .option('maxwidth', 'The max width of the embedded tweet. 220-550 inclusive.')
  .option('media', 'Expand photo and video previews')
  .option('thread', 'Expand tweet threads')
  .option('omit-script', 'Omit the script that loads Twitter\'s widget.js')
  .option('align', 'Float value for the embedded tweet.')

const flags = args.parse(process.argv)
