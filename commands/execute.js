const { isYoutubeUrl } = require('../util.js');

const { join } = require('../commands/join.js');
const { play } = require('../commands/play.js');
const { search } = require('../commands/search.js');

const ytdl = require('ytdl-core');

async function execute(message, queue, serverQueue) {
	const args = message.content.split(' ');
	console.log(args);
	
	let query = args[1];

	if (args.length > 2) {
		query = args.slice(1).join(" ");
	};

	permissionCheck(message);

	if (!serverQueue) {
		try {
			join(queue, serverQueue, message.guild, message.channel, message.member.voice.channel);
			serverQueue = queue.get(message.guild.id);
			
			if (isYoutubeUrl(query)) {
				songInfo = await ytdl.getBasicInfo(query);

				const song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
				};
	
				serverQueue.songs.push(song);
				play(queue, message.guild, serverQueue.songs[0], false);
			} else {
				search(serverQueue, query, message.member.id, message.channel);
			}
		}
		catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	}
	else {
		const searchResults = serverQueue.searchResults.get(message.member.id);
		if (serverQueue.songs > 1) {
			if (isYoutubeUrl(query)) {
				songInfo = await ytdl.getBasicInfo(query);

				const song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
				};
	
				serverQueue.songs.push(song);
			} else {
				if (searchResults) {
					if (isNaN(query)) {
						serverQueue.searchResult.delete(message.member.id);
						return message.channel.send('You need to enter a number between 1-5');
					}
		
					const numQuery = parseInt(query);
		
					const songUrl = searchResults[query - 1];
					songInfo = await ytdl.getBasicInfo(songUrl);
		
					const song = {
						title: songInfo.videoDetails.title,
						url: songInfo.videoDetails.video_url,
					};
		
					serverQueue.songs.push(song);
					return message.channel.send(`${song.title} has been added to the queue!`);
				} else {
					search(serverQueue, query, message.member.id, message.channel);
				}
			}
		}
		else if (searchResults) {
			if (isNaN(query)) {
				serverQueue.searchResults.delete(message.member.id);
				return message.channel.send('You need to enter a number between 1-5');
			}

			const numQuery = parseInt(query);

			// search results are 0 indexed
			const songUrl = searchResults[query - 1];
			songInfo = await ytdl.getBasicInfo(songUrl);

			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			};

			console.log(`SONGSsdsdsSS ${serverQueue.songs}`);
			serverQueue.songs.push(song);
			serverQueue.searchResults = new Map();
			if (serverQueue.songs.length === 1) {
				play(queue, message.guild, serverQueue.songs[0], false);
			} else {
				return message.channel.send(`${song.title} has been added to the queue!`);
			}
		} else {
			search(serverQueue, query, message.member.id, message.channel);
		}
	}
}

function permissionCheck(message) {
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		return message.channel.send(
			'You need to be in a voice channel to play music!',
		);
	}
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			'I need the permissions to join and speak in your voice channel!',
		);
	}
}

module.exports = {
    execute
};