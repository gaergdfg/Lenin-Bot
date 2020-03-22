const youtubeUtil = require("../youtube-util.js")
const discordUtil = require("../discord-util.js")
const ytdl = require("ytdl-core")


module.exports = {
	name: "play",
	description: "Plays requested video(s)",
	usage: "[-f|-list] {youtube link|requested phrase|youtube playlist link(with '-list' flag)}" +
		"\nExtra options:" +
		"\n[-f] (inserts a song right after the current song, jumping the queue)\n" +
		"\n[-list] (adds a whole playlist to the queue)",
	args: true,
	guildOnly: true,
	async execute(message, arguments) {
		if (!message.member.voice.channel) {
			throw "You must be in a voice channel to use '!play'"
		}

		try {
			await addRequestToQueue(message, arguments)
			await tryPlaying(message)
		} catch (err) {
			throw err
		}
	}
}


async function addRequestToQueue(message, arguments) {
	const { servers } = message.client
	const server = servers.get(message.guild.id)
	if (!server) {
		throw "I couldn't find the server this message was posted in"
	}

	if (arguments[0] == "-list") {
		try {
			const id = youtubeUtil.getPlaylistId(arguments[1])
			const playlistIds = await youtubeUtil.loadPlaylistQueryData(id)

			server.queue = server.queue.concat(playlistIds)
		} catch (err) {
			throw err
		}
	} else {
		const forced = arguments[0] == "-f"
		arguments = forced ? arguments.slice(1) : arguments

		let res
		try {
			res = await youtubeUtil.getVideoId(arguments)
			if (!res.arr) {
				id = res
			} else {
				let songs = []
				for (let i = 0; i < res.items.length; i++) {
					const { title, duration } = await youtubeUtil.getVideoInfo(res.items[i])
					songs.push(`${title} [${youtubeUtil.convertTime(duration)}]`)
				}
				discordUtil.sendEmbedQuestion(message, songs)
				id = res.items[0]
			}
			await addItemToQueue(id, server, forced)
		} catch (err) {
			throw err
		}
	}
}


/**
 * @description Adds video id and title to the queue
 * @param {string} id video idss
 * @param {*} server discord.js Guild the bot is operating in
 * @param {boolean} forced whether the video should jump the queue
 */
async function addItemToQueue(videoId, server, forced) {
	try {
		const { id, title } = await youtubeUtil.getVideoInfo(videoId)
		const item = {
			id: id,
			title: title
		}

		if (forced) {
			let firstItem = server.queue.length ? [server.queue[0]] : []
			server.queue = firstItem
				.concat([item])
				.concat(server.queue.slice(1))
		} else {
			server.queue.push(item)
		}
	} catch (err) {
		throw err
	}
}


/**
 * @description Starts playing if the bot is not playing already
 * @param {*} message discord.js Message sent
 */
async function tryPlaying(message) {
	const { servers } = message.client
	const server = servers.get(message.guild.id)

	if (!server) {
		throw "I can't use the server you are in >__<"
	}
	if (!server.queue.length) {
		throw "I don't have any songs to play o_O"
	}

	if (!server.isPlaying) {
		try {
			const channel = message.member.voice.channel
			const connection = await channel.join()

			await play(connection, server)
		} catch (err) {
			throw err
		}
	}
}


/**
 * @description Plays the first song in the servers queue
 * @param {*} connection discord.js Connection of the bot
 * @param {*} server discord.js Guild the bot is operating in
 */
async function play(connection, server) {
	try {
		const stream = await ytdl(
			`https://www.youtube.com/watch?v=${server.queue[0].id}`,
			{ filter: "audioonly" }
		)
		stream.on("error", err => {
			throw err
		})
		const streamOptions = {
			volume: 1
		}

		server.dispatcher = await connection.play(stream, streamOptions)
		server.isPlaying = true
		server.dispatcher.on("finish", () => {
			if (server.loopedSingle == true) {
				server.queue.unshift(server.queue.shift())
			} else if (server.loopedAll == true) {
				server.queue.push(server.queue.shift())
			} else {
				server.queue.shift()
			}
			if (server.queue[0]) {
				try {
					play(connection, server)
				} catch (err) {
					throw err
				}
			} else {
				server.loopedSingle = server.loopedAll = false
				server.isPlaying = false
				try {
					connection.disconnect()
				} catch (err) {
					console.log("play() connection error ->\n", err)
					throw "I had a problem disconnecting :c"
				}
			}
		})
	} catch (err) {
		connection.disconnect()
		console.log("play.js ->\n", err)
		throw "I had a problem playing this song"
	}
}
