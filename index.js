require('dotenv/config'); // gives all the env variables from the env file

const { Client } = require('discord.js');
const { OpenAI } = require('openai');

// import Client from 'discord.js';

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

// Know when the bot is online
client.on('ready', () => {
    console.log('Bot is online.');
});

// any message starting with ! will be ignored by the bot
const ignore_prefix = "!";
// channels we want the bot to reply in
const channels = ['1146709224685064272']

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

// When a message is sent, get access to that message
client.on('messageCreate', async (message) => {
    // console.log(message.content);
    // if message was sent by a bot, ignore it 
    if (message.author.bot) 
        return;
    // if message starts with the prefix, ignore it
    if (message.content.startsWith(ignore_prefix))
        return;
    // if message is not in the corresponding channels or does not ping the bot, ignore it
    if (!channels.includes(message.channelId) && !message.mentions.users.has(client.user.id))
        return;


    // Responding to a message
    const response = await openai.chat.completions.create({
        // model for the conversation
        model: 'gpt-3.5-turbo',
        messages: [
            {
                // name of the person
                role: 'system',
                content: 'ChatGBT Test bot'
            },
            {
                // name:
                role: 'user',
                content: message.content,
            }
        ]
    })
    .catch((error) => console.error('OpenAI Error:\n', error));

    message.reply(response.choices[0].message.content);
});

// Logging into the Bot
client.login(process.env.TOKEN);