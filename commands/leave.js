module.exports = {
    name: "leave",
    description: "Stops playing and leaves the voice channel",
    guildOnly: true,
	async execute(message, arguments) {
        const connections = await message.client.voice.connections
        const connection = connections.get(message.guild.id)
        if (!connection) {
            throw "It seems like I'm not playing anything"
        }

        const { servers } = message.client
        const server = servers.get(message.guild.id)
        if (!server) {
            throw "I couldn't find the server this message was posted in"
        }
        server.queue = []
        server.dispatcher.end()
    }
}
