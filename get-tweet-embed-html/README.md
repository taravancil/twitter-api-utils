This is a script for fetching the HTML provided by [Twitter's oEmbed
API](https://dev.twitter.com/rest/reference/get/statuses/oembed)
endpoint for a collection of tweets.

This is useful if you want to prefetch HTML instead of making a bunch
of client-side requests.

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
| -i, --input | The input file to read | |
| -o, --output | The path to write the output to | |
| --maxwidth | The max width of the embedded tweet. 220-550 inclusive. | 400 |
| -m, --media | Expand photo and video previews | false |
| -s, --script | Include the script that loads Twitter's widget.js | true |
| -t, --thread | Expand tweet threads | false |

### Input File Format

The --input option should be the path to a JSON file with the
following structure, where username is a twitter username and id is
a valid ID for one of that user's tweets.

```
{"tweets": [
  {"username": "taravancil", "id": "123"},
  {"username": "taravancil", "id": "456"}
]}

## Rate Limiting

This endpoint is not rate limited.

## Twitter oEmbed API Authentication

This API does not require authentication.