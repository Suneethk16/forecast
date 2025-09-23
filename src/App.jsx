import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    if (!city.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`
      )
      
      if (!response.ok) {
        throw new Error('City not found')
      }
      
      const data = await response.json()
      const current = data.current_condition[0]
      const area = data.nearest_area[0]
      
      setWeather({
        name: area.areaName[0].value,
        country: area.country[0].value,
        temp: current.temp_C,
        feels_like: current.FeelsLikeC,
        humidity: current.humidity,
        wind_speed: current.windspeedKmph,
        description: current.weatherDesc[0].value
      })
    } catch {
      setError('Unable to fetch weather data. Please try again.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  return (
    <div className="weather-app">
      <h1>Weather Forecast</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="city-input"
        />
        <button type="submit" disabled={loading} className="search-btn">
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.country}</h2>
          <div className="weather-info">
            <div className="temperature">{weather.temp}°C</div>
            <div className="description">{weather.description}</div>
            <div className="details">
              <span>Feels like: {weather.feels_like}°C</span>
              <span>Humidity: {weather.humidity}%</span>
              <span>Wind: {weather.wind_speed} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
