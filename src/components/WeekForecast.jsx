import React from 'react';
import tw from 'tailwind-styled-components';

import WeatherIcon from './WeatherIcon';

const Container = tw.ul`
    flex justify-evenly
    py-6
    border-t border-t-white/30
    bg-stone-300/30
    shadow
    backdrop-blur-sm
`;

const WeekForecast = (props) => {
    const { weatherData } = props;

    const getChineseDay = (datetimeString) => {
        const date = new Date(datetimeString);
        const day = date.getDay();

        const chineseDay = ['日', '一', '二', '三', '四', '五', '六'];
        return `星期${chineseDay[day]}`;
    };

    const EverydayForecast = () => {
        if(weatherData.length === 0) {
            return <li />;
        }
        
        const neededProperties = ['Wx', 'MinT', 'MaxT'];
        const weekWeatherForecast = weatherData.reduce((neededWeatherData, weatherElement) => {
            const propertyName = weatherElement.elementName;
            
            if(neededProperties.includes(propertyName)) {
                const neededTime = weatherElement.time.filter((data, index) => {
                    return index === 0 || data.startTime.includes('06:');
                });

                neededTime.forEach((data, index) => {
                    if(index === 7) {
                        return;
                    }

                    neededWeatherData[index].day = index === 0 ? '今天' : getChineseDay(data.startTime);
                    neededWeatherData[index][propertyName] = data.elementValue[0].value;
                });
            }
            
            return neededWeatherData;
        }, Array.from({ length: 7 }, () => ({})));

        return weekWeatherForecast.map((weatherForecast) => (
            <li key={weatherForecast.day} className="flex flex-col items-center text-white">
                <h5 className='py-1 font-bold'>{weatherForecast.day}</h5>
                <WeatherIcon weather={weatherForecast['Wx']} />
                <p className='py-1'>{weatherForecast['MinT']}° - {weatherForecast['MaxT']}°</p>
            </li>
        ));
    }

    return (
        <Container>
            <EverydayForecast />
        </Container>
    );
};

export default WeekForecast;