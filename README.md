# Slack Pongbot 🏓 🤖

This is a slack-bot to integrate with the CFA fast-track course slack channel.

It will display the ping-pong leaderboard by fetching data from the pong scoring API endpoint.

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

* game - fetches the last game played from /api/games and displays it in the slack message.

* more to come
