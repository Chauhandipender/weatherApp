import React, { useRef, useState, useEffect } from 'react';
import sunny_icon from "../assets/sunny.jfif";
import nightSunny_icon from "../assets/nightSunny.jpg";
import cloudy_icon from "../assets/cloudy.jpg";
import nightCloudy_icon from "../assets/nightCloudy.webp";
import scatterredClouds_icon from "../assets/scatteredClouds.jpg";
import nightScatteredClouds_icon from "../assets/nightScatteredClouds.jpg";
import rainShower_icon from "../assets/rainShowers.jpg";
import thunder_icon from "../assets/thunderstrom.jpg";
import rain_icon from "../assets/rain.jpg";
import snowfall_icon from "../assets/snowfall.webp";
import nightSnow_icon from "../assets/nightSnow.jpg";
import mist_icon from "../assets/mist.jpg";
import search_icon from "../assets/searchIcon.png";

const Weather = () => {
    const inputRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fade, setFade] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value);
        }
    }

    const icons = {
        "01d": sunny_icon,
        "01n": nightSunny_icon,
        "02d": cloudy_icon,
        "02n": nightCloudy_icon,
        "03d": scatterredClouds_icon,
        "03n": nightScatteredClouds_icon,
        "04d": cloudy_icon,
        "04n": nightCloudy_icon,
        "09d": rainShower_icon,
        "09n": rainShower_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "11d": thunder_icon,
        "11n": thunder_icon,
        "13d": snowfall_icon,
        "13n": nightSnow_icon,
        "50d": mist_icon,
        "50n": mist_icon
    };

    const [weatherData, setWeatherData] = useState({
        temperature: null,
        windSpeed: null,
        humidity: null,
        cityName: null,
        feelsLike: null,
        pressure: null,
        weather: null,
        iconId: null
    });

    const search = async (city) => {
        if (!city.trim()) {
            setError("Please enter a valid city name.");
            return;
        }

        setError(null);
        setFade(true);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("City not found or unable to fetch data.");
            }

            const data = await response.json();

            setTimeout(() => {
                setWeatherData({
                    temperature: Math.floor(data.main.temp),
                    windSpeed: data.wind.speed,
                    humidity: data.main.humidity,
                    cityName: data.name,
                    feelsLike: Math.floor(data.main.feels_like),
                    pressure: data.main.pressure,
                    weather: data.weather[0].main,
                    iconId: data.weather[0].icon
                });
                setFade(false);
            }, 100);

        } catch (error) {
            setError(error.message);
            setFade(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search("New York");
    }, []);

    return (
        <div>
            <div className="flex h-[80vh] w-[60vw] bg-slate-400 rounded-md flex-col overflow-hidden">
                <div className="w-full h-[60vh] overflow-hidden relative">
                    {loading ? (
                        <p className="text-white text-xl">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <img
                                className={`h-full w-full transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
                                src={icons[weatherData.iconId]}
                                alt=""
                            />
                            <div className="absolute bottom-[4vh] left-10 w-[20vw] h-[10vh] text-white text-2xl">
                                <p className="font-poppins">{weatherData.temperature}°C, {weatherData.weather}</p>
                                <p className="font-poppins">{weatherData.cityName}</p>
                            </div>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        className="text-black h-[4vh] pl-2 font-poppins text-sm bg-slate-300 absolute w-[23vw] right-[9vw] bottom-[7vh] rounded-l-full outline-none"
                        placeholder="Enter City"
                        type="text"
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="flex absolute items-center justify-center bottom-[7vh] right-[7vw] h-[4vh] w-[2.5vw] rounded-r-full bg-slate-500"
                        onClick={() => search(inputRef.current.value)}
                        
                    >
                        <img className="h-5 w-5" src={search_icon} alt="" />
                    </button>
                </div>

                <div className="grid w-full h-[20vh] bg-slate-900 text-white relative grid-cols-2 items-center content-evenly">
                    <p className="font-poppins">Humidity : {weatherData.humidity}%</p>
                    <p className="font-poppins">Wind-speed : {weatherData.windSpeed} km/h</p>
                    <p className="font-poppins">Pressure : {weatherData.pressure} mb</p>
                    <p className="font-poppins">Feels like : {weatherData.feelsLike}°C</p>
                </div>
            </div>
        </div>
    );
};

export default Weather;