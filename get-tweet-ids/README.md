This is a script for constructing a JSON object of all the tweet IDs
for a given Twitter user.

Twitter limits API requests within a 15-minute window. If you're using
a user auth token, you can do 180 requests every 15 minutes, if you have
an application auth token, you can do 300. More likely than not, you
have an application token.

Twitter also limits the amount of tweets that can be returned in each
request to 200, so that means for users with more than 36,000 tweets,
in order to get all tweet IDs, you'll need to run the script multiple
times, passing the --maxid and --existing options in all subsequent
runs.

## Usage

After install the dependencies, build it:

```
$ npm run build
```

Then run it!

```
$ npm start -- [options]
```

### Options

| Option | Description | Default |
| --- | --- | --- |
| -h, --help | Display help | |
| -c, --count | The number of tweets to fetch. Maximum 200 | Twitter's limits |
| -m, --maxid | The ID of the most recent tweet to fetch | |
| -o, --output | The file to write to | |
| --replies | Include replies | false |
| --retweets | Include retweets | false |
| -u, --username | The Twitter user whose tweets the script will fetch ||


## Example

```
$ npm start -- -u taravancil -c 3 --retweets

// {"ids":[790917264040009700,789267779245318100,789108553315344400]}
//
// The ID of the last fetched tweet is:
// 789108553315344400
```

## Twitter API Keys and Tokens

Before running the script, set the following environment variables:

```
export TWITTER_API_KEY='your-twitter-api-key'
export TWITTER_API_SECRET='your-twitter-api-secret'
export TWITTER_ACCESS_TOKEN='your-twitter-access-token'
export TWITTER_ACCESS_TOKEN_SECRET='your-twitter-access-token-secret'
```

See [Twitter's OAuth
documentation](https://dev.twitter.com/oauth/overview) for more information.