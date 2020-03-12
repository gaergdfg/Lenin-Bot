const fetch = require("node-fetch")
// const fetchVideoInfo = require("youtube-info")
const { youtubeApiKey } = require("./settings.json")
const youtubeRegex = /^https?:\/\/(www\.youtube\.com\/watch\?v\=|y2u\.be\/|youtu\.be\/)[a-zA-Z0-9-_]{11}[&|^a-zA-Z0-9-_]?/
// const correctUrls = new Set([
// 	"youtube.com",
// 	"youtu.be",
// 	"y2u.be"
// ]);


exports.getVideoId = async (arguments) => {
	if (youtubeRegex.test(arguments[0])) {
		console.log('regex is fine')
		if (/[a-zA-Z0-9]{12}/.test(arguments)) {
			throw "Incorrect Url"
		}
		const res = /[a-zA-Z0-9]{11}/.exec(arguments[0])
		const id = res ? res[0] : null
		console.log("i got the id: ", id)
		if (!id) {
			console.log("the id was trash tho")
			throw "Couldn't find the video id"
		}
		return id
	} else {
		console.log("uh oh, we're in, calling for a response")
		const query = arguments.join(" ")
		const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&type=video&maxResults=5`);
		const json = await response.json();
		if (json.error) {
			throw json.error.message
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
