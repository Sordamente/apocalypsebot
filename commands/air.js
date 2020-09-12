const Discord = require('discord.js');
const { airvisual } = require('../config.json');
const https = require('https');

module.exports = {
	name: 'air',
	description: 'gets information about air quality',
    aliases: ['weather'],
    args: false,
	execute(message, args) {
		https.get(`https://api.airvisual.com/v2/nearest_city?key=${airvisual}`, (res) => {
			let data = '';
			res.on('data', (chunk) => { data += chunk });

			res.on('end', () => {
				let parsed = JSON.parse(data);
				if (parsed.status != "success") return message.channel.send("the IQair api is kinda scuffed atm, sorry");
				parsed = parsed.data;

		    	console.log(`curled IQair for ${parsed.city}`);

				const dp = Math.round(parsed.current.weather.tp - ((100-parsed.current.weather.hu)/5));

				const desc = {
					temperature: parsed.current.weather.tp + `°C or ${Math.round(parsed.current.weather.tp*1.8+32)}°F`,
					humidity: parsed.current.weather.hu + '%',
					dew: dp + '°C | ' + (dp < 4 ? 'dry' : (dp <= 16 ? 'comfy' : (dp < 19 ? 'humid' : 'muggy'))),
				}

				const airEmbed = new Discord.MessageEmbed()
		        	.setColor('#f0932b')
		        	.setTitle(parsed.current.pollution.aqius)
					.setDescription(`Air quality for the city of ${parsed.city}`)
					.addFields(
						{name: 'Temperature', value: desc.temperature, inline: true},
						{name: 'Humidity', value: desc.humidity, inline: true},
						{name: 'Dew Point', value: desc.dew, inline: true},
					)
					.addField('Advisory','coming soon')
					.setTimestamp()
					.setFooter('blame IQair api not apocalypsebot pls uwu')

				message.channel.send(airEmbed);
			});
		}).on("error", (err) => {
			console.log(err.message);
		});
	},
};
