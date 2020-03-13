const util = require("../youtube-util.js")
const ytdl = require("ytdl-core")

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
        arguments = forced ? arguments.slice(1) : arguments
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
            id = res.items[0]
        }
        const { servers } = message.client
        const server = servers.get(message.guild.id)
        if (!server) {
            throw "I couldn't find the server this message was posted in"
        }
        try {
            addItemToQueue(message, id, server, forced)
        } catch (err) {
            throw err
        }
	}
}

async function addItemToQueue(message, id, server, forced) {
    const startPlaying = !server.queue[0]
    let videoInfo
    try {
        videoInfo = await util.getVideoInfo(id)
        if (forced) {
            server.queue = [server.queue[0]].concat([videoInfo]).concat(server.queue.slice(1))
        } else {
            server.queue.push(videoInfo)
        }
        if (startPlaying) {
            const channel = await message.member.voice.channel
            let connection = await channel.join()
            play(connection, server)
        }
    } catch (err) {
        throw err
    }
}


async function play(connection, server) {
    console.log("play() called")
    try {
        const stream = await ytdl(`https://www.youtube.com/watch?v=${server.queue[0].id}`, { filter: "audioonly" })
        stream.on("error", err => {
            console.log("Error during ytdl stream")
            throw err
        })
        const streamOptions = {
            volume: 1
        }
        server.dispatcher = await connection.play(stream, streamOptions)
        server.dispatcher.on("end", () => {
            if (server.loopedSingle == true) {
                server.queue.unshift(server.queue.shift())
            } else if (server.loopedAll == true) {
                server.queue.push(server.queue.shift())
			} else {
				server.queue.shift()
			}
            if (server.queue[0]) {
                play(connection, server)
            } else {
                connection.disconnect()
                server.loopedSingle = server.loopedAll = false
            }
        })
    } catch (err) {
        throw err
    }
}
