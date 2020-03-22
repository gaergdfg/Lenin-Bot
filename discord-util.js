const Discord = require("discord.js")

const digits = [
	"0⃣",
	"1⃣",
	"2⃣",
	"3⃣",
	"4⃣",
	"5⃣",
	"6⃣",
	"7⃣",
	"8⃣",
	"9⃣"
]


exports.sendEmbedQuestion = (message, fields) => {
	const count = Math.min(fields.length, 9)
	try {
		let embed = new Discord.MessageEmbed()
			.setTitle(`Choose an option with 1 - ${count} reactions`)
			.setColor(message.member.displayColor ? message.member.displayHexColor : [255, 100, 255])
		for (let i = 0; i < count; i++) {
			embed = embed.addField(`**Option #${i + 1}**`, fields[i])
		}
		message.channel.send(embed)
	} catch (err) {
		console.error(err)
		throw "Discord is not letting me send embeds today :c"
	}
}
