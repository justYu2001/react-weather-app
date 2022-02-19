import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tw from 'tailwind-styled-components';

const TodayForecast = (props) => {
    const { county, onCountyChange } = props;

    const [weather, setWeather] = useState({
        description: '',
        temperature: '',
        minTemperature: '',
        maxTemperature: '',
        probabilityOfPrecipitation: '',
    });

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const weatherApiUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091';
           
                const configs = {
                    params: {
                        Authorization: 'CWB-2F4BD805-77BC-41DB-92C7-15371EF9C7F7',
                        locationName: county,
                    },
                };
    
                const response = await axios.get(weatherApiUrl, configs);
                const weatherData = response.data.records.locations[0].location[0].weatherElement;
                const neededProperties = ['Wx', 'PoP12h', 'T', 'MinT', 'MaxT'];
                const neededWeatherData = weatherData.reduce((neededProperty, property) => {
                    if(neededProperties.includes(property.elementName)) {
                        neededProperty[property.elementName] = property.time[0].elementValue[0].value;
                    }

                    return neededProperty;
                }, {});

                return neededWeatherData;
    
            } catch (error) {
                console.error(error);
            } 
        };

        const initializeWeather = async () => {
            const weatherData = await fetchWeatherData();
            setWeather({
                description: weatherData['Wx'],
                temperature: weatherData['T'],
                minTemperature: weatherData['MinT'],
                maxTemperature: weatherData['MaxT'],
                probabilityOfPrecipitation: weatherData['PoP12h'],
            });

            onCountyChange(weatherData['Wx']);
        };

        initializeWeather();

    }, [county, onCountyChange]);
    
    return (
        <div className='text-white'>
            <span className='text-6xl mr-2'>{ weather.temperature }°C</span>
            <span className='text-2xl'>{ county }</span>
            <p className='py-1 px-2 text-lg'>{ weather.description }</p>
            <ul className='flex p-2'>
                <li className='mr-4'>
                    <h4>降雨機率</h4>
                    <p className='px-0.5 text-3xl'>{ weather.probabilityOfPrecipitation } %</p>
                </li>
                <li className='mr-4'>
                    <h4>最低溫度</h4>
                    <p className='px-0.5 text-3xl'>{ weather.minTemperature }°C</p>
                </li>
                <li>
                    <h4>最高溫度</h4>
                    <p className='px-0.5 text-3xl'>{ weather.maxTemperature }°C</p>
                </li>
            </ul>
        </div>
    );
};

export default TodayForecast;