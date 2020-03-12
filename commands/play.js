const util = require("../youtube-util.js")

module.exports = {
	name: "play",
    description: "Plays a requested video",
    args: true,
    usage: "[-f] {youtube link|requested phrase}",
    guildOnly: true,
	async execute(message, arguments) {
        if (!message.member.voice.channel) {
            throw "You must be in a voice channel to use '!play'"
        }
        const forced = arguments[0] == "-f"
        arguments = forced ? arguments.splice(1) : arguments
        let res
		try {
            res = await util.getVideoId(arguments)
        } catch (err) {
            throw err
        }
        console.log(res)
        if (!res.arr) {
            id = res
        } else {
            id = res[0]
        }
        const { servers } = message.client
        const server = servers.get(message.guild.id)
        if (!server) {
            throw "I couldn't find the server this message was posted in"
        }
        addItemToQueue(id, server, forced)
	}
}

function addItemToQueue(id, server, forced) {
    const startPlaying = server.queue == []
    
}
