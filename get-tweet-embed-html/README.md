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

## Twitter oEmbed API Authentication

This API does not require authentication.