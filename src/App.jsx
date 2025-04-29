import axios from 'axios'
import { useEffect, useState } from 'react'

const Weather = ({ capital }) => {
	const [weatherData, setWeatherData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!capital)
			return

		setError(null)
		setWeatherData(null)

		axios
			.get(`/.netlify/functions/fetchWeather?query=${capital}`)
			.then((response) => {
				setWeatherData(response.data)
			})
			.catch(error => setError(error))
	}, [capital])

	if (error)
		return (<p>Failed to load weather: {error.message}</p>)

	if (!weatherData)
		return (<p>Loading weather data for {capital}...</p>)

	return (
		<div className='weather'>
			<h1>Weather in {capital}</h1>
			<p>Temperture {weatherData.current.temp_c} Celsius</p>
			<img alt="weather icon" src={weatherData.current.condition.icon} />
			<p>Wind {(weatherData.current.wind_kph / 3.6).toFixed(1)} m/s</p>
		</div>
	)
}

const View = ({ country }) => {
	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>
				Capital {country.capital}<br />
				Area {country.area}
			</p>
			<h1>Languages</h1>
			<ul>
				{Object.values(country.languages).map((value, index) => (
					<li key={index}>{value}</li>
				))}
			</ul>
			<img alt={country.flags.alt} src={country.flags.svg} width={200}/>
		</div>
	)
}

const DisplayView = ({ country }) => {

	return (
		<div className='country-view'>
			<View country={country} />
			<Weather capital={country.capital} />
		</div>
	)
}

const Country = ({ country }) => {
	const [showView, setShowView] = useState(false)

	return (
		<div>
			{country.name.common}
			<button onClick={() => setShowView(!showView)}>{showView ? 'hide' : 'show'}</button>
			{showView && <DisplayView country={country} />}
		</div>
	)
}

const ListCountries = ({ countries }) => {

	return ( 
		countries.map(country => {
			return (
				<Country key={country.name.common} country={country} />
			)
		})
	)
}

const Display = ({ data }) => {

	if (data.length > 1 && data.length <= 10){
		return (
			<ListCountries countries={data}/>
		)
	} else if (data.length === 1) {
		return (
			<DisplayView country={data[0]} />
		)
	} else {
		return (
			<>Too many matches, specify another filter</>
		)
	}
}

const App = () => {
	const [filter, setFilter] = useState('')
	const [countries, setCountries] = useState(null)
	const [filteredCountries, setFilteredCountries] = useState([])
	const [error, setError] = useState(null)
	
	useEffect(() => {
		axios
			.get('https://studies.cs.helsinki.fi/restcountries/api/all')
			.then((response) => {
				setError(null)
				setCountries(response.data)
			})
			.catch((error) => {
				console.log(error)
				setError(error)
			})
	}, [])

	const handleChange = (event) => {
		event.preventDefault()
		if (countries.length !== 0)
		{
			setFilteredCountries(
				countries.filter(obj => (
					obj.name.common.toLowerCase().includes(event.target.value.toLowerCase())
			)))
		}
		setFilter(event.target.value)
	}

	if (!countries)
			return (<p>Loading countries data...</p>)

	if (error)
		return (<p>Failed to fetch countries data: {error.message}</p>)

  return (
    <>
			<div className='filter'>
				find countries <input value={filter} onChange={handleChange}></input>
			</div>
			{filter && <Display data={filteredCountries} />}
    </>
  )
}

export default App
