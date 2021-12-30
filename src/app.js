import tmi from 'tmi.js'
import { Client } from 'tmi.js';
import { username } from 'tmi.js/lib/utils';
import { BOT_USERNAME, OAUTH_TOKEN, CHANNEL_NAME } from './constant';

const options = {
    options: {debug: true },
    connection: {
        reconnect: true, 
        secure: true
    },
    identity: {
        username: BOT_USERNAME, 
        password: OAUTH_TOKEN
    },
    channels: CHANNEL_NAME
}

const twoArgsRegex = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?([a-zA-Z0-9]+)?(?:\W+)?(.*)?/);
const oneArgsRegex = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const noArgsRegex = new RegExp(/^!([a-zA-Z0-9]+)?/);

let active = true;
let timeout;

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


const client = new tmi.Client(options);

client.connect();
client.on('message', (channel, userstate, message, self) => {
    
    if (self) return;

    if (message.match(twoArgsRegex)){
        const [raw, command, argument1, argument2] = message.match(twoArgsRegex);

        if (command === 'pyramid') {

            if (active) {
                let limit = 0;
                if (channel === '#bassnix'){
                    limit = 40;
                } else {
                    limit = 10;
                }
    
                if (!argument2) return;
    
                const size = parseInt(argument2)
                const emote = argument1 + ' ';
        
                if (size<=limit){
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
                }, 30000)
            } else {
                client.say(channel, `DOCING wait for ${getTimeLeft(timeout)}s`);
            }

            
        }

        if (command === 'tank') {
            client.say(channel, `█ ${argument1} █ █ ] ▄▄▄▄▄▄▄ ${argument2} ............ ▂▄▅█████████▅▄▃▂ ........... ███████████████████ ] ........... ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤`)
        }
    } else if (message.match(oneArgsRegex)) {
        const [raw, command, argument] = message.match(oneArgsRegex);
    } 

    if (message === '!ping') {
        let time = process.uptime();
        let uptime = (time + "").toHHMMSS();
        client.say(channel, `MrDestructoid bassnixBOT has been running for ${uptime} `);
    }
});

async function getdata(url) {
    const response = fetch(url);
    const data = await response.json();
    const { quote } = data;

    return quote;
}

function getTimeLeft(timeout) {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout)/1000 - process.uptime());
}


