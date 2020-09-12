const fs = require('fs');
const Discord = require('discord.js');
const { prefix, discord } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log("aaaand we're up!");
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return message.reply("sorry sir/maam/pal, that command don't exist");

    if (command.guildOnly && message.channel.type === 'dm') return message.reply('that\'s a server-only command chief');

    if (command.args && !args.length)
		return message.channel.send('smh, you\'re using the command incorrectly');

    if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    	if (now < expirationTime) {
    		const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`oml stop spamming \`${command.name}\`, literally just wait like ${timeLeft.toFixed(1)} more second(s)`);
    	}
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
    	command.execute(message, args);
    } catch (error) {
    	console.error(error);
    	message.reply('my sincerest apologies sir/maam/pal, but the command erred. oof');
    }
});

client.login(discord);
