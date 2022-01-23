import { stat } from 'fs';
import { ClientRequest } from 'http';
import tmi from 'tmi.js'
import {
    Client
} from 'tmi.js';
import {
    username
} from 'tmi.js/lib/utils';


const https = require('https');

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: ['jeyrossa', 'bassnix']
}

const twoArgsRegex = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?([a-zA-Z0-9!@#$&()`.+_,/"-]+)?(?:\W+)?(.*)?/);
const tenshiRegex = new RegExp(/tenshiWut/gi);

let active = true;
let timeout;
let trivia = false;
let questions;
let tries = 0;
let questionsIndex = 0;
let status = 'offline';
let start = false;

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}


const client = new tmi.Client(options);

client.connect();
client.on('message', (channel, userstate, message, self) => {

    if (self) return;

    // if (message.match(tenshiRegex)){
    //     client.say(channel, `TenshiWut 🤙 WUUUUT`);
    // }

    if (!message.startsWith('!')) return;

    if (status === 'offline') {

    }
    if (message.match(twoArgsRegex)) {
        const [raw, command, argument1, argument2] = message.match(twoArgsRegex);

        if (command === 'pyramid' || command === 'p') {

            if (active) {
                let limit = 0;
                if (channel === '#bassnix' || channel === '#bassnixBOT') {
                    limit = 50;
                } else {
                    limit = 10;
                }

                const size = parseInt(argument2)
                const emote = argument1 + ' ';
                const emoteMaxSize = emote.length * size;

                if (emoteMaxSize <= 500) {
                    if (size <= limit) {
                        for (let i = 1; i <= size; i++) {
                            client.say(channel, `${emote.repeat(i)}`);
                        }

                        for (let i = (size - 1); i > 0; i--) {
                            client.say(channel, `${emote.repeat(i)}`);
                        }
                    } else {
                        client.say(channel, `Please put less or equal than ${limit} emote`)
                    }

                    active = false
                    timeout = setTimeout(() => {
                        active = true
                    }, 10000)
                } else {
                    client.say(channel, `LULE exceed max characters limit (${emoteMaxSize}/500)`)
                }


            } else {
                client.say(channel, `DOCING wait for ${getTimeLeft(timeout)}s`);
            }
        }

        if (command === 'tank') {
            client.say(channel, `█ ${argument1} █ █ ] ▄▄▄▄▄▄▄ ${argument2} ............ ▂▄▅█████████▅▄▃▂ ........... ███████████████████ ] ........... ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤`)
        }
    }

    const args = message.slice(1).split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd === 'fill') {
        let word = args.join(' ');
        let concatWord = '';
        let limit = 500;
        let length = 0;

        while (length < limit) {
            concatWord = concatWord.concat(word, " ");
            length = concatWord.length + 1;
        }

        client.say(channel, `${concatWord}`);

    }

    if (cmd === 'ping') {
        let time = process.uptime();
        let uptime = (time + "").toHHMMSS();
        client.say(channel, `MrDestructoid bassnixBOT has been running for ${uptime} `);
    }

    if (cmd === 'eg') {
        client.say(channel, `=eg`);
    }

    if (cmd === 'gibeg') {
        client.say(channel, `=gibeg bassnix all`)
    }

    if (cmd === 'hpn') {
        client.say(channel, `FeelsOkayMan FireWorks Happy New Year`);
    }

    if (cmd === 'kiras') {
        let copypasta = "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.";
        client.say(channel, `${copypasta}`);
    }

    if (cmd === 'trivia' && status === 'offline' && start == false) {
        client.say(channel, `Hmm searching for question...`)
        start = true;
        if (trivia === false) {
            let category = args.join(' ');
            let api;
            if (args == '') {
                api = 'https://api.gazatu.xyz/trivia/questions?count=1'
            } else {
                api = `https://api.gazatu.xyz/trivia/questions?include=[${category}]&count=1`
            }

            // client.say (channel, api)

            // api = `https://api.gazatu.xyz/trivia/questions?include=[Anime]&count=1`

            https.get(api, (resp) => {
                let data = '';

                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    if (data === '[]') {
                        client.say(channel, `Please refer the category name here https://gazatu.xyz/trivia/categories?sC=name&sD=asc it is case sensitive Danki`)
                    } else {
                        questions = JSON.parse(data)
                        client.say(channel, `lacGlasses question: ${questions[questionsIndex].question}`);
                        client.say(channel, `category: ${questions[questionsIndex].category}`);
                        trivia = true;
                    }
                    start = false;

                });

                resp.on("error", (err) => {
                    client.say(channel, `Sadeg cannot start trivia`)
                    trivia = false;
                    start = false;
                });

            });

        }
        else {
            client.say(channel, `Madge trivia already started`);
            client.say(channel, `lacGlasses question: ${questions[questionsIndex].question}`);
            client.say(channel, `category: ${questions[questionsIndex].category}`);
            start = false;
        }


    }

    if (cmd === 'ans' && trivia === true && status === 'offline') {
        let userAnswer = args.join(' ').trim();
        let correctAnswer = questions[questionsIndex].answer.trim();
        let firstHint = correctAnswer.substring(0, 2)
        let secondHint = correctAnswer.substring(2)
        let second = secondHint.replace(/\d|\w/g, "_")
        let hint = firstHint.concat(second);

        if (userAnswer.toLowerCase() == correctAnswer.toLowerCase()) {
            client.say(channel, `FeelsOkayMan ${userstate.username} is correct. The answer is "${questions[questionsIndex].answer}"`);
            tries = 0;
            trivia = false;
        }
        else {
            tries += 1;
            client.say(channel, `FeelsDankMan wrong answer`);

            switch (tries) {
                case 2:
                    client.say(channel, `First Hint: ${questions[questionsIndex].hint1}`);
                    break;
                case 4:
                    client.say(channel, `Second Hint: ${questions[questionsIndex].hint2}`);
                    break;
                case 6: 
                    client.say(channel, `Third Hint: ${correctAnswer.replace(/\d|\w/g, "_")}`)
                    break;
                case 8:
                    if (correctAnswer.length != 2) {
                        client.say(channel, `Last Hint: ${hint}`)
                    }
                    break;
                case 10:
                    client.say(channel, `The answer is "${questions[questionsIndex].answer}"`);
                    client.say(channel, `trivia ended NaM`);
                    trivia = false;
                    break;
            }

        }
    }

    if (cmd === 'endtrivia' && status === 'offline') {
        if (trivia === true) {
            client.say(channel, `The answer is "${questions[questionsIndex].answer}"`)
            client.say(channel, `trivia ended NaM`);
            tries = 0;
            trivia = false;
        } else {
            client.say(channel, `Must start a trivia first using !trivia`)
        }
    }

    if (cmd === 'help') {
        if (args === 'trivia') {
            client.say(channel, `use !trivia to start a trivia`)
        }
    }

    if (cmd === 'set') {
        if (args == 'offline') {
            status = 'offline';
            client.say(channel, `the bot has been set to on`);
        } else if (args == 'online') {
            status = 'online';
            client.say(channel, `the bot has been set to off`);
        }
    }

    if (cmd === 'animequote') {
        https.get('https://animechan.vercel.app/api/random', (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {

                let quote = JSON.parse(data)
                client.say(channel, `"${quote.quote}" - ${quote.character}`);
            });

            resp.on("error", (err) => {
                client.say(channel, `Sadeg cannot start trivia`)
            });
        });

    }
});

function getTimeLeft(timeout) {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime());
}