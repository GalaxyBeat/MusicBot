const { minVolumeInput, maxVolumeInput } = require('../constants.js');

async function volume(message, serverQueue) {
	if (!serverQueue) {
		return message.channel.send(`Queue has not been setup for this server!`);
	}
	else {
		const args = message.content.split(' ');
		const inputVolume = args[1];
	
        // also add check for integer based value
		if (isNaN(inputVolume)) {
			return message.channel.send(`A number is expected!`);
		}
	
		if (inputVolume < minVolumeInput || inputVolume > maxVolumeInput) {
			return message.channel.send(`Volume can only be between 0 and 200!`);
		}
	
		// 0 is no sound. 1 is normal. 2 is double
		const convertedVolume = inputVolume / 100;
		serverQueue.volume = convertedVolume;
		serverQueue.resource.volume.setVolume(convertedVolume);
	}
}

module.exports = {
    volume
};