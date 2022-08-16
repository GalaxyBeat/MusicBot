const { prefix, token } = require('./config.json');

const { execute } = require('./commands/execute.js');
const { leave } = require('./commands/leave.js');
const { join } = require('./commands/join.js');
const { showQueue } = require('./commands/show-queue.js');
const { search } = require('./commands/search.js');
const { volume } = require('./commands/volume.js');

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates],
});

const queue = new Map();

// client listeners
client.once('ready', c => {
	console.log('Ready!');
	console.log(`Logged in as ${c.user.tag}`);
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('messageCreate', message => {
	console.log(`message: ${message.content}`);

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	const args = message.content.split(' ');
	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, queue, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}skip`)) {
		// skip(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}stop`)) {
		// stop(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}volume`)) {
		volume(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}join`)) {
		join(queue, serverQueue, message.guild, message.channel, message.member.voice.channel);
		return;
	}
	else if (message.content.startsWith(`${prefix}leave`)) {
		leave(queue, serverQueue, message.guild, message.channel);
		return;
	}
	else if (message.content.startsWith(`${prefix}search`)) {
		search(args[1], message.member.id, message.channel);
		return;
	}
	else if (message.content.startsWith(`${prefix}queue`)) {
		showQueue(serverQueue, message.channel);
		return;
	}
	else if (message.content.startsWith(`${prefix}help`)) {
		message.channel.send('Shut up nerd.');
		return;
	}
	else {
		message.channel.send('You need to enter a valid command!');
	}
});

// login to discord with client's token
client.login(token);