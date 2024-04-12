const axios = require('axios');
const PREFIXES = ["ai", "yuno2"];

async function askClaire(api, event, message) {
    try {
        const prompt = encodeURIComponent(event.body.split(" ").slice(1).join(" "));
        const apiUrl = 'https://lianeapi.onrender.com/ask/claire?query='; // Updated API endpoint

        const response = await axios.get(`${apiUrl}${prompt}`);

        if (response.data && response.data.message) {
            const messageText = response.data.message;
            const messageId = await api.sendMessage(messageText, event.threadID);
            message.unsend(messageId);
            console.log('Sent answer as a reply to the user');
        } else {
            throw new Error('sorry d ko mahanap');
        }
    } catch (error) {
        console.error(`wala akong mahanap may error: ${error.stack || error.message}`);
        api.sendMessage(
            `may error ulitin mo. Details: ${error.message}`,
            event.threadID
        );
    }
}

function startsWithPrefix(body) {
    const lowerCaseBody = body.toLowerCase();
    return PREFIXES.some(prefix => lowerCaseBody.startsWith(`${prefix} `));
}

module.exports = {
    config: {
        name: 'yuno2',
        version: '2.5',
        author: 'JV Barcenas && LiANE For AI',
        credits: 'JV Barcenas && LiANE For AI',
        role: 0,
        usePrefix: true,
        hasPermission: 2,
        category: 'Ai',
        commandCategory: 'Ai',
        description: 'Baliw na yuno ai',
        usages: '[prompt]',
        shortDescription: {
            en: 'Baliw na yuno ai',
        },
        longDescription: {
            en: 'Baliw na yuno ai',
        },
        guide: {
            en: '{pn} [prompt]',
        },
    },
    onStart: async function (context) {
        // Your onStart logic here
        console.log('Bot is starting...');
        // Add any additional startup logic here
        console.log('Bot started successfully!');
    },
    onChat: async function (context) {
        const { api, event, message } = context;

        if (!startsWithPrefix(event.body)) {
            return;
        }

        message.reply(`Bot is answering your question, please wait..`, async (err) => {
            if (!err) {
                await askClaire(api, event, message);
            }
        });
    },
    run: async function (context) {
        await module.exports.onStart(context);
    }
};
