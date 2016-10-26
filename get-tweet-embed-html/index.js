#!/usr/bin/env node

const args = require('args')

args
  .option('maxwidth', 'The max width of the embedded tweet. 220-550 inclusive.')
  .option('media', 'Expand photo and video previews')
  .option('thread', 'Expand tweet threads')
  .option('omit-script', 'Omit the script that loads Twitter\'s widget.js')
  .option('align', 'Float value for the embedded tweet.')

const flags = args.parse(process.argv)

validateOptions()

function validateOptions () {
  if (flags.maxwidth && (flags.maxwidth < 220 || flags.maxwidth > 550)) {
    console.error('maxwidth must be in range 220-550')
    process.exit()
  } else if (flags.align && !['center', 'right', 'none'].contains(flags.align)) {
    console.error('invalid value for align option')
    process.exit()
  }
}
