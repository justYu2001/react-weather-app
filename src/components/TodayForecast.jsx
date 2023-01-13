import React from 'react';

import { useTranslation } from 'react-i18next';

const TodayForecast = (props) => {
    const { county, weatherData } = props;

    const neededProperties = ['Wx', 'PoP12h', 'T', 'MinT', 'MaxT'];
    const neededWeatherData = weatherData.reduce((neededProperty, property) => {
        if(neededProperties.includes(property.elementName)) {
            neededProperty[property.elementName] = property.time[0].elementValue[0].value;
        }

        return neededProperty;
    }, {});

    const weather = {
        description: neededWeatherData['Wx'],
        temperature: neededWeatherData['T'],
        minTemperature: neededWeatherData['MinT'],
        maxTemperature: neededWeatherData['MaxT'],
        probabilityOfPrecipitation: neededWeatherData['PoP12h'],
    };

    const { t } = useTranslation();
  
    return (
        <div className='text-white'>
            <span className='text-6xl mr-2'>{ weather.temperature }°C</span>
            <span className='text-2xl'>{t(county)}</span>
            <p className='py-1 px-2 text-lg'>{t(weather.description)}</p>
            <ul className='flex p-2'>
                <li className='mr-4'>
                    <h4>{t("降雨機率")}</h4>
                    <p className='px-0.5 text-3xl'>{ weather.probabilityOfPrecipitation } %</p>
                </li>
                <li className='mr-4'>
                    <h4>{t("最低溫度")}</h4>
                    <p className='px-0.5 text-3xl'>{ weather.minTemperature }°C</p>
                </li>
                <li>
                    <h4>{t("最高溫度")}</h4>
                    <p className='px-0.5 text-3xl'>{ weather.maxTemperature }°C</p>
                </li>
            </ul>
        </div>
    );
};

export default TodayForecast;