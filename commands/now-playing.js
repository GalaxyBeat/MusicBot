const { formatDuration } = require('../util.js');

const ytdl = require('ytdl-core');

async function nowPlaying(queue, serverQueue, textChannel) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}
	else {
		if (serverQueue.songs) {
			const currentSong = serverQueue.songs[0];
			const songInfo = await ytdl.getBasicInfo(currentSong.url);
			const outputString = `**${songInfo.videoDetails.title}** (${formatDuration(songInfo.videoDetails.lengthSeconds)})\n${songInfo.videoDetails.video_url}`;
			return textChannel.send(outputString);
		} else {
			return textChannel.send('There are no songs currently playing!');
		}
	}
}

module.exports = {
	nowPlaying,
};