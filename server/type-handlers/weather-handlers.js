const fetch = require('node-fetch');

const queryWeather = async (query, typeGraph) => {
	let q = null;

	//find location
	if (query.city && query.city.match) {
		q = query.city.match;
	} else if (query.latitude && query.latitude.match && query.longitude && query.longitude.match) {
		q = `${query.latitude.match},${query.longitude.match}`;
	} else {
		throw 'Unknown location';
	}

	//get the data
	const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${q}`);
	const data = await response.json();

	//return value
	const result = {
		//EMPTY
	};

	//pick out each valid field
	if (query.last_updated) {
		result['last_updated'] = data.current.last_updated;
	}
	if (query.temp_c) {
		result['temp_c'] = data.current.temp_c;
	}
	if (query.temp_f) {
		result['temp_f'] = data.current.temp_f;
	}
	if (query.condition) {
		result['condition'] = data.current.condition.text;
	}
	if (query.wind_mph) {
		result['wind_mph'] = data.current.wind_mph;
	}
	if (query.wind_kph) {
		result['wind_kph'] = data.current.wind_kph;
	}
	if (query.wind_dir) {
		result['wind_dir'] = data.current.wind_dir;
	}

	return result;
};

const changeWeather = async (query, typeGraph) => {
	throw "You can't change the weather!";
}

module.exports = {
	queryWeather,
	createWeather: changeWeather,
	updateWeather: changeWeather,
	deleteWeather: changeWeather,
};