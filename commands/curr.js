module.exports = {
	name: "curr",
	description: "Displays currently played song",
	guildOnly: true,
	async execute(message, arguments) {
		const { servers} = message.client
		const server = servers.get(message.guild.id)
		if (!server) {
			throw "I couldn't find the server this message was posted in"
		}
		if (!server.queue.length) {
			throw "I'm not playing anything at the moment"
		}

		message.channel.send(`Current song: ${server.queue[0].title}`)
	}
}
