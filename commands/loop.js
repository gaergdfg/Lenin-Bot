module.exports = {
    name: "loop",
    description: "Loops the queue",
    usage: "{single|all|off}",
    args: true,
    guildOnly: true,
    execute(message, arguments) {
        const { servers } = message.client
        const server = servers.get(message.guild.id)
        switch (arguments[0]) {
            case "single":
                server.loopedSingle = true
                server.loopedAll = false
                break
            case "all":
                server.loopedSingle = false
                server.loopedAll = true
            case "off":
                server.loopedSingle = server.loopedAll = false
            default:
                message.channel.send(`The argument you provided is wrong, the correct arguments are: \`${this.usage}\``)
        }
    }
}
