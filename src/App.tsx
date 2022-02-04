import React, {useEffect, useMemo, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {
  //creating IP state
  const [geoLocation, setGeoLocation] = useState<{latitude: number, longitude: number}>({latitude: 0, longitude: 0});
  const [weather, setWeather] = useState<{main: {humidity: number, temp: number}, weather: [{description: string, icon: string}]}>();
  const [imageUrl, setImageUrl] = useState<string>('')

  const getData = async () => {
    let value = await fetch("https://geolocation-db.com/json/")
    let value1 = await value.json()
    setGeoLocation(value1)
    let value2 = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + value1.latitude + "&lon=" + value1.longitude + "&units=metric&appid=dcf3b1df6e4f335cc54415656e0d81dd")
    let value3 = await value2.json()
    setImageUrl('https://openweathermap.org/img/wn/' + value3.weather[0].icon + '@4x.png')
    setWeather(value3)
    localStorage.setItem('imageUrl', imageUrl)
    localStorage.setItem('description', value3.weather[0].description)
    localStorage.setItem('temp', value3.main.temp)
    localStorage.setItem('hum', value3.main.humidity)
    localStorage.setItem('long', value1.longitude)
    localStorage.setItem('lat', value1.latitude)
  }

  useMemo(() => {
    let long = localStorage.getItem('long')
    let lat = localStorage.getItem('lat')

    let geo: {latitude: number, longitude: number} = {latitude: lat ? Number(lat) : 0, longitude: long ? Number(long) : 0}

    setGeoLocation(geo)

    let image = localStorage.getItem('imageUrl');
    if (image){
      setImageUrl(image)
    }

    let newWeather: {main: {humidity: number, temp: number}, weather: [{description: string, icon: string}]} = {main: {humidity: 0, temp: 0}, weather: [{description: '', icon: ''}]};

    let desc = localStorage.getItem('description')
    newWeather.weather[0].description = desc ? desc : '';

    let temp = localStorage.getItem('temp')
    newWeather.main.temp = temp ? Number(temp) : 0;

    let hum = localStorage.getItem('hum')
    newWeather.main.humidity = hum ? Number(hum) : 0;

    setWeather(newWeather)
  }, [])

  useEffect( () => {
    getData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div className="icon-spinner weather-icon-container">
          <img src={imageUrl} className="icon-scaler weather-icon"/>
        </div>
        {weather && <div>
          <p>
            {weather.weather[0].description}<br/>
            Temperature: {weather.main.temp}°C<br/>
            Humidity: {weather.main.humidity}%
          </p>
        </div>}
        <p>
          Latitude: {geoLocation.latitude}<br/>
          Longitude: {geoLocation.longitude}
        </p>
      </header>
    </div>
  );
}

export default App;
