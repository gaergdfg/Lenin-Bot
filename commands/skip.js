const { prefix } = require("../settings.json")

module.exports = {
	name: "skip",
	description: "Skips song(s)",
	usage: "{number of songs to skip|null}\nSkips one song by default",
	guildOnly: true,
	execute(message, arguments) {
		const { servers } = message.client
		const server = servers.get(message.guild.id)
		if (!server) {
			throw "I couldn't find the server this message was posted in"
		}

		const count = arguments[0] ? parseInt(arguments[0], 10) : 1
		if (isNaN(count)) {
			return message.channel.send(
				`${arguments[0]} is not a number` +
				`Correct usage: \`${prefix}skip ${this.usage}\``
			)
		}

		server.queue.splice(0, count - 1)
		try {
			server.dispatcher.end()
		} catch (err) {
			throw "I'm confused, can't stop playing >__<"
		}
	}
}
