const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'lists all of apocalypsebot\'s commands',
	aliases: ['commands'],
	usage: '[command name]',
    cooldown: 5,
	execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('here ya go:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`also, \`${prefix}help [command name]\` exists`);

            return message.author.send(data, { split: true })
            	.then(() => {
            		if (message.channel.type === 'dm') return;
            		message.reply('i dm\'ed you a list of my commands lol');
            	})
            	.catch(error => {
            		console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            		message.reply('oop i think you disabled dms so i can\'t dm you rn');
            	});
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.reply('that command doesn\'t even exist lmao');

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
	},
};
