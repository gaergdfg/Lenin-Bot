const fetch = require("node-fetch")
const fetchVideoInfo = require("youtube-info")
const { youtubeApiKey } = require("./settings.json")
const youtubeRegex = /^https?:\/\/(www\.youtube\.com\/watch\?v\=|y2u\.be\/|youtu\.be\/)[a-zA-Z0-9-_]{11}[&|^a-zA-Z0-9-_]?/


/**
 * Extracts the video id from the url provided or
 * returns an array of the first 5 results of a Youtube API search
 */
exports.getVideoId = async (arguments) => {
	if (youtubeRegex.test(arguments[0])) {
		if (/[a-zA-Z0-9-_]{12}/.test(arguments)) {
			throw "Incorrect Url (12+ signs)"
		}
		const res = /[a-zA-Z0-9-_]{11}/.exec(arguments[0])
		const id = res ? res[0] : null
		if (!id) {
			throw "Couldn't find the video id"
		}
		return id
	} else {
		const query = arguments.join(" ")
		const response = await fetch(
			"https://www.googleapis.com/youtube/v3/search?" +
			"part=id" + 
			"&type=video" + 
			`&q=${encodeURIComponent(query)}` +
			`&key=${youtubeApiKey}` +
			"&maxResults=5"
		);
		const json = await response.json();
		if (json.error) {
			console.error(json.error.message)
			throw "I couldn't get comrade YOUrij TUBEtov to cooperate"
		}
		const items = json.items;
		const videosCount = json.pageInfo.totalResults
		if (videosCount == 0) {
			throw "Couldn't find any videos :c"
		}
		let res = {
			arr: true,
			items: []
		}
		for (let i = 0; i < Math.min(5, videosCount); i++) {
			res.items[i] = items[i].id.videoId
		}
		return res
	}
}


/**
 * Returns videos' id, title and duration
 */
exports.getVideoInfo = async (id) => {
	let info
	try {
		info = await fetchVideoInfo(id)
	} catch (err) {
		console.error(err)
		throw "I can't fetch, who's the good boi then?"
	}
	if (!info.title || !info.duration) {
		console.error("Invalid getVideoInfo feedback")
		throw "Youtube API ain't no snitch, it won't give me names"
	}
	return {
		id: id,
		title: info.title,
		duration: info.duration
	}
}


/**
 * Converts youtube playlist id into a Youtube API query
 */
const getPlaylistQuery = (id) => {
	return "https://www.googleapis.com/youtube/v3/playlistItems?" +
	"part=snippet" +
	"&maxResults=50" +
	`&playlistId=${id}` +
	`&key=${youtubeApiKey}`
}


/**
 * Returns an array of info about all songs from Youtube API query
 */
const loadPlaylistPage = async (json) => {
	let result = []
	for (let song of json.items) {
		const info = this.getVideoInfo(song.snippet.resourceId.videoId)
		result.push(info)
	}
	return result
}


/**
 * Returns an array of info about every song in a playlist
 */
exports.loadPlaylistData = async(id) => {
	let result = [], response, json, query
	do {
		query = getPlaylistQuery(id)
		query += json.nextPageToken ? json.nextPageToken : ""
		response = await fetch(query)
		json = await response.json()
		if (json.error) {
			console.error(json.error.message)
			throw "I couldn't get comrade YOUrij TUBEtov to cooperate"
		}
		result.concat(loadPlaylistPage(json))
	} while (json.nextPageToken)
	return result
}
