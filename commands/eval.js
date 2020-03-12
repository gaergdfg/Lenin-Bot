const { prefix, myId } = require("../settings.json")

module.exports = {
	name: "eval",
    description: "None of your business",
    arguments: true,
    usage: "{code to execute}",
    guildOnly: true,
	execute(message) {
		if (message.author.id != myId) {
            return
        }
        eval(message.content.slice((prefix + "eval ").length))
	}
}
