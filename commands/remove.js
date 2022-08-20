const { showQueue } = require('./show-queue');
const { skip } = require('./skip');

async function remove(serverQueue, textChannel, searchValue) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}

	if (!Number.isInteger(parseInt(searchValue))) {
		return textChannel.send('Please enter a valid number!');
	}
	if (!serverQueue.songs) {
		return textChannel.send('There are no songs to remove!');
	}

	if (searchValue == 1) {
		skip(serverQueue, textChannel);
	}
	else if (searchValue < 1 || searchValue > serverQueue.songs.length) {
		return textChannel.send('Please enter a song number from the queue!');
	}

	serverQueue.songs.splice((searchValue - 1), 1);
	showQueue(serverQueue, textChannel);
}

module.exports = {
	remove,
};