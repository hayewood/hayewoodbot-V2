/* global sb */
module.exports = (function () {
    "use strict";

    const DankTwitch = require("dank-twitch-irc");


    return class Twitch {
        constructor() {
            this.client = new DankTwitch.ChatClient({
				username: process.env.BOTNAME,
				password: process.env.OAUTH
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
            client.on("USERNOTICE", async(messageObject) => { /* ... */ });
            client.on("USERSTATE", async (messageObject) => {
                const { emoteSets } = messageObject;
				const strings = [
					emoteSets.sort().join(","),
					(this.availableEmoteSets)
						? this.availableEmoteSets.sort().join(",")
						: null
				];
            });
            client.on("NOTICE", async (messageObject) => {});
            client.on("CLEARCHAT", (messageObject) => {});


        }

        async handleMessage (messageObject) {
            const {ircTags, badges, bits, channelName, messageText: message, senderUserID, senderUsername} = messageObject;
			const messageType = (messageObject instanceof DankTwitch.WhisperMessage)
				? "whisper"
                : "message";
                
            let channelData = null;
			const userData = await hb.User.get(senderUsername, false);
			if (!userData) {
				return;
            }
            // Check and execute command if necessary
			if (message.startsWith('#')) {
				let userState = {};
				if (messageType === "message") {
					userState = messageObject.extractUserState();
				}

                const [command, ...args] = message.replace(/^\$\s*/, "$").split(" ");
                const result = await this.handleCommand(
                    command, 
                    senderUsername,
                    channelName,
                    args,
                    {
						userBadges: userState.badges,
						userBadgeInfo: userState.badgeInfo,
						color: userState.color,
						colorRaw: userState.colorRaw,
						privateMessage: (messageType === "whisper")
					}
                );
            }
        }

        async handleCommand(command, user, channel, args = [], options = {}) {
            const userData = await hb.User.get(user, false);
            const channelData = await hb.Channel.get(channel);
            
            var res = await hb.Command.checkExec(command, args, user, channel, options);
            this.client.say(channel, res);
        }
    }   
})();