This is a script for constructing a JSON object of all the tweet IDs
for a given Twitter user.

Twitter limits API requests within a 15-minute window. If you're using
a user auth key, you can do 180 requests every 15 minutes, if you have
an application auth key, you can do 300.

Twitter also limits the amount of tweets that can be returned in each
request to 200, so that means for users with more than 36,000 tweets,
in order to get all tweet IDs, you'll need to run the script multiple
times, passing the --maxid option in all subsequent runs.
