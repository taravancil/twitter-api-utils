#!/usr/bin/env node

const args = require('args')
const OAuth = require('oauth').OAuth
const fs = require('fs')

// Your Twitter API keys and tokens
// See README.md for further instructions
const API_KEY = process.env.TWITTER_API_KEY
const API_SECRET = process.env.TWITTER_API_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET

// Set up OAuth
const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  API_KEY,
  API_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
)

args
  .option('maxid', 'The value to pass to the max_id parameter in the request')
  .option('username', 'The Twitter user whose tweets the script will fetch')
  .option('count', 'The number of tweets to fetch. Maximum 200')
  .option('retweets', 'Include retweets')
  .option('output', 'The file to write to')
  .option('replies', 'Include replies')
  .option('existing', 'The path to an existing JSON file with "ids" key')

const flags = args.parse(process.argv)

validateOptions()

let existingIds = []
if (flags.existing) {
  const f = fs.readFileSync(flags.existing)
  existingIds = JSON.parse(f).ids
}

// The ID of the last tweet fetched
let lastFetched

getTweetIds()

function validateOptions () {
  if (!flags.username) {
    console.error('Username is required')
    process.exit()
  } else if (flags.count > 200) {
    console.error('Max count is 200. Fetching 200 tweets...')
  } else if (flags.existing) {
    try {
      fs.stat(flags.existing)
    } catch (err) {
      console.error(`${flags.existing} does not exist`)
      process.exit()
    }
  }
}

function constructRequestURL (username, tweetCount, includeRetweets,
                              maxID, includeReplies) {
  const base = 'https://api.twitter.com/1.1/statuses/user_timeline.json?'
  const screenname = `screen_name=${username}`
  const retweets = `&include_rts=${includeRetweets || false}`
  const replies = `&exclude_replies=${!includeReplies}`
  const count = `&count=${tweetCount || 200}`

  let maxTweetID = ''
  if (maxID) {
    maxTweetID = `&max_id=${maxID}`
  }

  return `${base}${screenname}${retweets}${replies}${maxTweetID}${count}`
}

async function getTweetIds () {
  let ids = []
  let isSubsequentRun = false

  const {username, retweets, replies, count} = flags

  // Keep requesting tweets until we hit the Twitter API limits or
  // we've reached the desired count
  outerLoop:
  for (;;) {
    try {
      let tweets = await getTweets(username, count, retweets, lastFetched, replies)

      // If this is a subsequent run, ignore the first tweet in the
      // response data, which will be the last tweet from the last run
      if (isSubsequentRun) {
        tweets = tweets.slice(1)
      }

      // Parse the tweet IDs
      for (const tweet of tweets) {
        ids.push(tweet.id)
        if (ids.length === count) {
          lastFetched = ids[ids.length - 1]
          break outerLoop
        }
      }

      // Set lastFetched to the ID of the last tweet in the response
      lastFetched = ids[ids.length - 1]

      // Flip flag
      isSubsequentRun = true
    } catch (err) {
      // We've hit the rate limit for this endpoint, stop requesting
      // tweets, but proceed to process the ones we already retrieved
      if (err.statusCode === 429) {
        console.log('Too many requests to the Twitter API.')
        console.log(`Continue later by running the script with the
      --maxid option set to ${lastFetched} and --existing to the path
      of your existing JSON file`)
        break
      }

      // There are no more tweets in the timeline, still process the
      // ones we already retrieved
      if (err === 'No tweets available' && ids.length) break

      console.error(err)
      process.exit()
    }
  }

  // Done fetching tweet IDs, concatenate ids with existingIds and
  // put the resulting array of in a top-level object
  ids = existingIds.concat(ids)
  const output = `{"ids":${JSON.stringify(ids)}}`

  if (flags.output) {
    require('fs').writeFileSync(flags.output, output, 'utf8')
    console.log(`Wrote output to ${flags.output}`)
  } else {
    console.log(output)
  }
  console.log(`\nThe ID of the last fetched tweet is:\n${lastFetched}`)
}

function getTweets (username, count, retweets, lastFetched, replies) {
  const req = constructRequestURL(username, count, retweets, lastFetched, replies)

  return new Promise((resolve, reject) => {
    oauth.get(req, ACCESS_TOKEN, ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        reject(err)
      }

      data = JSON.parse(data)

      if (!data.length) {
        reject('No tweets available')
      }

      resolve(data)
    })
  })
}
