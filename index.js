// https://discordapp.com/oauth2/authorize?client_id=CLIEND_ID&scope=bot
const Discord = require("discord.js")
const bot = new Discord.Client()

bot.commands = new Discord.Collection()
const fs = require("fs")
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	bot.commands.set(command.name, command)
}

const { token, prefix } = require("./settings.json")


bot.on("ready", () => {
    bot.servers = new Discord.Collection()
    for (const server of bot.guilds.cache) {
        const init = {
            queue: [],
            loopedSingle: false,
            loopedAll: false
        }
        bot.servers.set(server[0], init)
    }
    console.log("░░░░░░░░░░▀▀▀██████▄▄▄░░░░░░░░░░\n░░░░░░░░░░░░░░░░░▀▀▀████▄░░░░░░░\n░░░░░░░░░░▄███████▀░░░▀███▄░░░░░\n░░░░░░░░▄███████▀░░░░░░░▀███▄░░░\n░░░░░░▄████████░░░░░░░░░░░███▄░░\n░░░░░██████████▄░░░░░░░░░░░███▌░\n░░░░░▀█████▀░▀███▄░░░░░░░░░▐███░\n░░░░░░░▀█▀░░░░░▀███▄░░░░░░░▐███░\n░░░░░░░░░░░░░░░░░▀███▄░░░░░███▌░\n░░░░▄██▄░░░░░░░░░░░▀███▄░░▐███░░\n░░▄██████▄░░░░░░░░░░░▀███▄███░░░\n░█████▀▀████▄▄░░░░░░░░▄█████░░░░\n░████▀░░░▀▀█████▄▄▄▄█████████▄░░\n░░▀▀░░░░░░░░░▀▀██████▀▀░░░▀▀██░░")
})


bot.on("message", async (message) => {
    if (message.author.id === bot.user.id || !message.content.startsWith(prefix)) {
        return
    }
    
    const arguments = message.content.slice(prefix.length).trim().split(/\s+/)
    const commandName = arguments.shift()
    const command = bot.commands.get(commandName)
    
    if (!bot.commands.has(commandName)) {
        return message.channel.send(`I don't have a command called: ${commandName}`)
    }
    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply("I can't execute that command inside DMs");
    }
    if (command.args && !arguments.length) {
        let reply = `You didn't provide any arguments dummy`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply)
    }

    try {
        await command.execute(message, arguments)
    } catch (err) {
        message.channel.send(err)
        console.error(err)
    }
})


process.on("unhandledRejection", err => {
	console.error("Unhandled promise rejection: ", err)
})


bot.login(token)
