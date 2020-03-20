const { prefix } = require("../settings.json")

module.exports = {
    name: "help",
    description: "List all commands or give info about a specific command",
    usage: "{command name|null}",
    aliases: ["commands"],
    guildOnly: true,
    execute(message, args) {
		const data = []
		const { commands } = message.client

		if (!args.length) {
			data.push("Here's a list of all my commands:")
			data.push(commands.map(command => command.name).join(", "))
			data.push(`\nYou can use \`${prefix}help ${this.usage}\` to get info about a specific command`)
			return message.channel.send(data, { split: true })
		}

		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))
		if (!command) {
			return message.reply("That's not a valid command")
		}

		data.push(`**Name:** ${command.name}`)
		if (command.aliases)
			data.push(`**Aliases:** ${command.aliases.join(', ')}`)
		if (command.description)
			data.push(`**Description:** ${command.description}`)
		if (command.usage)
			data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)

		message.channel.send(data, { split: true })
	}
}
