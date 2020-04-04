/* global sb */
module.exports = (function () {
    "use strict";

    const DankTwitch = require("dank-twitch-irc");


    return class Twitch {
        constructor() {
            this.client = new DankTwitch.ChatClient({
				username: process.env.BOTNAME,
				password: process.env.OAUTH,
				rateLimits: 30
            }); 

            console.log(process.env.OAUTH)
            this.initListeners();
            
            this.client.connect();
			this.client.joinAll(hb.Channel.data.map(i => i.Name));

        }

        initListeners () {
            const client = this.client;
            

			client.on("error", error => {
				if (error instanceof DankTwitch.JoinError && error.failedChannelName) {
				}
				else if (error.cause instanceof DankTwitch.SayError && error.message.includes("2000")) {
					console.debug(error.message);
				}
			});

			client.on("JOIN", ({channelName, joinedUsername}) => {
				console.debug(joinedUsername, channelName);

            });
            client.on("PRIVMSG", (privMessage) => { this.handleMessage(privMessage); });
            client.on("WHISPER", (message) => { this.handleMessage(message) });
            client.on("USERNOTICE", async(messageObject) => { /* ... */ })

        }

        async handleMessage (messageObject) {
            const {ircTags, badges, bits, channelName, messageText: message, senderUserID, senderUsername} = messageObject;
			const messageType = (messageObject instanceof DankTwitch.WhisperMessage)
				? "whisper"
				: "message";

        }
    }
})();