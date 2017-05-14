# Slack Pongbot 🏓 🤖

This is a slack-bot to integrate with the CFA fast-track course slack channel.

It will display the ping-pong leaderboard by fetching data from the pong scoring API endpoint.

![looping gif](https://media.giphy.com/media/l0Iy56x8OCifK6ZEc/giphy.gif)

[Planning - Trello Board](https://trello.com/b/qKxZTwj5/slack-pongbot)

[Dynamic Pilgrim - The CFA Pong App](http://dynamicpilgrim.herokuapp.com)

[Dynamic Pilgrim - The Github Repo](https://github.com/BinnyK/dynamic-pilgrim)

## Install

Clone this repo

Run

`npm install`

To start the bot, run

`token=<MY TOKEN> node slack_bot.js`

The token is the API key for the bot in your slack integration.

## Pongbot understands:

* "won", "last", "lost" - fetches the last game played from /api/v1/games and shows who won and lost

* "most points", "leaderboard", "top", "points" - fetches the (already sorted) list of players from /api/v1/players

* more to come
