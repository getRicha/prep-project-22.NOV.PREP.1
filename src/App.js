import React, { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/input/SearchBar";
import Map from "./components/Map";
import logo from "./mlh-prep.png";
import { change_bg, change_icon } from "./color_scheme.js";
import Carryitems from "../src/components/CarryItems/Carryitems"
function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [weatherType, setWeatherType] = useState("");

  const [cityCoordinates, setCityCoordinates] = useState({
    lat: 51.505,
    lon: -0.09,
  });

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_APIKEY}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            setWeatherType(result.weather[0].main)
            setCityCoordinates({
              lat: result.coord.lat,
              lon: result.coord.lon,
            });
            change_bg(result?.weather[0].main)
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const weather = weatherType => {
    switch (weatherType) {
      case "Clouds":
        return "cloudy";
      case "Clear":
        return "clear";
      case "Rain":
        return "rainy";
      case "Snow":
        return "snowy";
      case "Thunderstorm":
        return "stormy";
      case "Drizzle":
        return "drizzly";
      default:
        return "haze";
    }
  };

  return (
    <React.Fragment>
      <img className="logo" src={logo} alt="MLH Prep Logo"></img>
      <div>
        <h2>Enter a city below 👇</h2>
        <SearchBar setCity={setCity} />

        <div className="Results">
          {!isLoaded && <h2>Loading...</h2>}
          {/* {console.log(results)} */}
          {isLoaded && results && (
            <>
              <h3>{results.weather[0].main}</h3>
              <p>Feels like {results.main.feels_like}°C</p>
              <i>
                <p>
                  {results.name}, {results.sys.country}
                </p>
              </i>
            </>
          )}
        </div>
        <div className="weather-map">
          <Carryitems/>
          <Map 
            city={city}
            setCity={setCity}
            cityCoordinates={cityCoordinates}
            setCityCoordinates={setCityCoordinates}/>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
