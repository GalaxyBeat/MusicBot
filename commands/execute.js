const { isYoutubeUrl, parseMessageContentToQuery } = require('../util.js');

const { join } = require('../commands/join.js');
const { play, playByQuery } = require('../commands/play.js');
const { search } = require('../commands/search.js');

const ytdl = require('ytdl-core');

async function execute(message, queue, serverQueue) {
	permissionCheck(message);

	let query = parseMessageContentToQuery(message.content);

	// if server queue for guild has not been created yet
	// create server queue and then immediately play song based on query input
	if (!serverQueue) {
		try {
			join(queue, serverQueue, message.guild, message.channel, message.member.voice.channel);
			serverQueue = queue.get(message.guild.id);
			playByQuery(queue, serverQueue, message.guild, message.member.id, message.channel, query);
		}
		catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	}
	// else if a server queue exists
	else {
		const userSearchResults = serverQueue.searchResults.get(message.member.id);
		
		// if there is already a song playing, we want to enqueue the song
		if (serverQueue.songs != 0) {
			if (isYoutubeUrl(query)) {
				songInfo = await ytdl.getBasicInfo(query);

				const song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
				};
	
				serverQueue.songs.push(song);
			} else {
				if (userSearchResults) {
					enqueueSongChoice(queue, serverQueue, message.guild, message.member.id, message.channel, query, userSearchResults);
				} else {
					search(serverQueue, query, message.member.id, message.channel);
				}
			}
		}
		// if there is not, then we either play or search for songs based on if there is an existing song search
		else if (userSearchResults) {
			enqueueSongChoice(queue, serverQueue, message.guild, message.member.id, message.channel, query, userSearchResults);
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

async function enqueueSongChoice(queue, serverQueue, guild, memberId, textChannel, query, userSearchResults) {
	if (isNaN(query)) {
		serverQueue.searchResults.delete(memberId);
		return textChannel.send('You need to enter a number between 1-5');
	}

	const songUrl = userSearchResults[query - 1];
	songInfo = await ytdl.getBasicInfo(songUrl);

	const song = {
		title: songInfo.videoDetails.title,
		url: songInfo.videoDetails.video_url,
	};

	serverQueue.songs.push(song);

	// clear user's current search results
	serverQueue.searchResults.delete(memberId);

	// if this is the only song then immediately start playing
	if (serverQueue.songs.length === 1) {
		play(queue, guild, serverQueue.songs[0], false);
	} else {
		return textChannel.send(`${song.title} has been added to the queue!`);
	}
}

module.exports = {
    execute
};