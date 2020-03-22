module.exports = {
	name: "fplay",
	description: 
		"Plays a requested video right after the current song, " +
		"jumping the queue",
	usage: "{youtube link|requested phrase}",
	args: true,
	guildOnly: true,
	execute(message, arguments) {
		const { commands } = message.client
		const play = commands.get("play")
		if (!play) {
			console.error("'play.js' not available")
			throw "Idk what happened >__<"
		}
		play(message, ["-f"].concant(arguments))
	}
}
