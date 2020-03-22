const { myId } = require("../settings.json")

module.exports = {
	name: "eval",
	description: "None of your business",
	usage: "[-q] {code to execute}",
	arguments: true,
	execute(message, arguments) {
		if (message.author.id != myId) {
			return
		}
		try {
			if (arguments[0] == "-q") {
				message.delete()
				arguments.shift()
			}
			eval(arguments.join(" "))
		} catch (err) {
			console.error(err)
		}
	}
}
