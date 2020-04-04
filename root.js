(async function() {
    "use strict";
    const dotenv = require('dotenv');
    dotenv.config();

    await require("bot-core")("hb");

    class Root {
        constructor() {
            this.data = {};
            this.started = new Date();

            this.files = [
                "clients/twitch"
            ];

            this.clients = {};

            for (const client of this.files) {
                
                const start = process.hrtime.bigint();
                const [type] = client.split("/");
                let component = require("./" + client);

                try {
					this.clients.client = new component();
				}catch(error) {
                    console.debug(error);
                }

            }
        }
    }
    hb.Root = new Root();

})();