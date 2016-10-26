This is a script for fetching the HTML provided by [Twitter's oEmbed
API](https://dev.twitter.com/rest/reference/get/statuses/oembed)
endpoint for a collection of tweets.

This is useful for a couple of reasons:

1. It allows you to rogramatically embed Tweets while avoiding
Twitter's API rate limits. Sending client-side requests to the oEmbed
API each time a user visits your app will surely result in rate
limiting-related annoyances.
2. It's faster! Making the requests required to fetch HTML prior to
the rendering on the client is more performant than fetching and
rendering client-side.

## Usage

Run it!

```
$ npm start -- [options]
```

### Options

| Option | Description | Default |
| --- | --- | --- |
| -h, --help | Display help | |
| -a, --align | Float value for the embedded tweet. left, right, center | none |
| --maxwidth | The max width of the embedded tweet. 220-550 inclusive. | 400 |
| -m, --media | Expand photo and video previews | false |
| -o, --omit-script | Omit the script that loads Twitter's widget.js | false |
| -t, --thread | Expand tweet threads | false |


## Twitter oEmbed API Authentication

This API does not require authentication.