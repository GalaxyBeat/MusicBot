function isYoutubeUrl(query) {
    return /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$/i.test(query);
}

function parseMessageContentToQuery(messageContent) {
	const args = messageContent.split(' ');
	console.log(args);
	
	let query = args[1];

	if (args.length > 2) {
		query = args.slice(1).join(" ");
	};

    return query;
}

function formatDuration(durationSeconds) {
	var hours = Math.floor(durationSeconds / 60 / 60);
	var minutes = Math.floor(durationSeconds / 60);
	var seconds = durationSeconds % 60;
	
	return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

module.exports = {
	formatDuration,
    isYoutubeUrl,
    parseMessageContentToQuery
};