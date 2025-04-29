const axios = require("axios")

exports.handler = async (event) => {
	const API_KEY = process.env.WEATHER_API_KEY
	const { query } = event.queryStringParameters || {}
	const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`

	if (!query) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing 'query' parameter (e.g., USD)" }),
    }
  }

	await axios.get(URL)
		.then((response) => {
			return {
				statusCode: response.status,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify(response.data),
			}
		})
		.catch((error) => {
			const statusCode = error.response?.status || 500
			const errorMsg = error.response?.data?.message || "Failed To Fetch Data"
			return {
				statusCode: statusCode,
				headers: {
					"Content-Type": "application/json",
        	"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({error: errorMsg}),
			}
		})
}