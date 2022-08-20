const { isYoutubeUrl } = require('../util.js');
const { search } = require('../commands/search.js');

const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');

function play(queue, guild, song, queueInitiated) {
	const serverQueue = queue.get(guild.id);

	if (!song && queueInitiated) {
		//serverQueue.connection.leave();
		//queue.delete(guild.id);
		return;
	}

    const stream = ytdl(song.url, {
        filter: "audioonly",
        fmt: "mp3",
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0, //disabling chunking is recommended in discord bot
        bitrate: 128,
        quality: "lowestaudio",
    });

    const resource = createAudioResource(stream, { inlineVolume: true});
    resource.volume.setVolume(serverQueue.volume);
	serverQueue.resource = resource;

    serverQueue.player.play(resource);
    serverQueue.player.addListener("idle", (message) => {
        serverQueue.songs.shift();
		if (serverQueue.songs) {
			play(queue, guild, serverQueue.songs[0], true);
		}
    });

	serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}

async function playByQuery(queue, serverQueue, guild, memberId, textChannel, query) {
    if (isYoutubeUrl(query)) {
        songInfo = await ytdl.getBasicInfo(query);

        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        serverQueue.songs.push(song);
        play(queue, guild, serverQueue.songs[0], false);
    } else {
        search(serverQueue, query, memberId, textChannel);
    }
}

module.exports = {
    play,
    playByQuery
};