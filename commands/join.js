const { defaultVolume } = require('../constants.js');

const { joinVoiceChannel } = require('@discordjs/voice');

async function join(queue, serverQueue, guild, textChannel, voiceChannel) {
	if (!serverQueue) {

		// creating the contract for our queue
		const queueConstruct = {
			textChannel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: defaultVolume,
			playing: false,
			player: null,
			resource: null,
            searchResults: new Map()
            
		};

		// setting the queue using our contract
		queue.set(guild.id, queueConstruct);

		try {
            const connection = joinVoiceChannel(
                {
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });
            queueConstruct.connection = connection;
		}
		catch (err) {
			console.log(err);
			queue.delete(guild.id);
			return textChannel.send(err);
		}
	} else {
        return textChannel.send('I am already in the channel!');
    }
}

module.exports = {
    join
};