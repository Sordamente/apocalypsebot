module.exports = {
	name: 'reload',
	description: 'reloads a command',
    args: true,
    usage: '<command name>',
    cooldown: 1,
	execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
        	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`\`${commandName}\` doesn\'t exist as a valid command rip`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
        	const newCommand = require(`./${command.name}.js`);
        	message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`reloaded \`${command.name}\` or smth`);
        } catch (error) {
        	console.log(error);
        	message.channel.send(`frick, i messed up loading \`${command.name}\`, big sad:\n\`${error.message}\``);
        }

	},
};
