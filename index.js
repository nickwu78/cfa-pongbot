"use strict";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      ___         ___           ___           ___                         ___                 
     /  /\       /  /\         /__/\         /  /\         _____         /  /\          ___   
    /  /::\     /  /::\        \  \:\       /  /:/_       /  /::\       /  /::\        /  /\  
   /  /:/\:\   /  /:/\:\        \  \:\     /  /:/ /\     /  /:/\:\     /  /:/\:\      /  /:/  
  /  /:/~/:/  /  /:/  \:\   _____\__\:\   /  /:/_/::\   /  /:/~/::\   /  /:/  \:\    /  /:/   
 /__/:/ /:/  /__/:/ \__\:\ /__/::::::::\ /__/:/__\/\:\ /__/:/ /:/\:| /__/:/ \__\:\  /  /::\   
 \  \:\/:/   \  \:\ /  /:/ \  \:\~~\~~\/ \  \:\ /~~/:/ \  \:\/:/~/:/ \  \:\ /  /:/ /__/:/\:\  
  \  \::/     \  \:\  /:/   \  \:\  ~~~   \  \:\  /:/   \  \::/ /:/   \  \:\  /:/  \__\/  \:\ 
   \  \:\      \  \:\/:/     \  \:\        \  \:\/:/     \  \:\/:/     \  \:\/:/        \  \:\
    \  \:\      \  \::/       \  \:\        \  \::/       \  \::/       \  \::/          \__\/
     \__\/       \__\/         \__\/         \__\/         \__\/         \__\/                

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node index.js

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit');
var os = require('os');
var axios = require('./node_modules/axios');
const gamesEndpoint = 'http://dynamicpilgrim.herokuapp.com/api/v1/games'
const playersEndpoint = 'http://dynamicpilgrim.herokuapp.com/api/v1/players'

// Get the last game
let lastGame = []
function getGame(){
    axios.get(gamesEndpoint)
        .then(function(response){
            lastGame.push(response["data"][0])
            console.log("Game is:", lastGame);
        })
        .catch(function(error) {
            console.log(error);
        });
};
getGame()

// Get players
let players = []
function getPlayers() {
    axios.get(playersEndpoint)
        .then(function(response){
            players.push(response["data"])
            console.log("Players", players)
        })
};
getPlayers()
console.log(players[0])

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['won', 'last', 'lost'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'table_tennis_paddle_and_ball',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, `${lastGame[0].winner_name} just absolutely drop kicked ${lastGame[0].loser_name} by ${lastGame[0].winner_score} to ${lastGame[0].loser_score}`);
    });    
})

//leaderboard
controller.hears(['most points', 'top', 'leaderboard', 'points'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'table_tennis_paddle_and_ball',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, `CFA Pong Top 5:\n:trophy:${players[0][0].username} - Points: ${players[0][0].points}\n:slightly_smiling_face:${players[0][1].username} - Points: ${players[0][1].points}\n:neutral_face:${players[0][2].username} - Points: ${players[0][2].points}\n:slightly_frowning_face:${players[0][3].username} - Points: ${players[0][3].points}\n:rage:${players[0][4].username} - Points: ${players[0][4].points}`)
    });
})

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });

                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
