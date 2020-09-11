const Discord = require('discord.js');

module.exports = {
	name: 'air',
	description: 'gets information about air quality',
    usage: '(optional postal code)',
    aliases: ['weather'],
    args: false,
	execute(message, args) {
        const airEmbed = new Discord.MessageEmbed()
        	.setColor('#eeeeee')
        	.setTitle('the air is not good')

		message.channel.send(airEmbed);
	},
};
