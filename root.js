(async function() {
    "use strict";
    const dotenv = require('dotenv');
    dotenv.config();

    await require("bot-core")("hb");

    class Root {
        constructor() {
            this.data = {};
            this.started = new Date();
        }
    }
})();