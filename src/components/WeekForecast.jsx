import React from 'react';
import tw from 'tailwind-styled-components';

import WeatherIcon from './WeatherIcon';

const Container = tw.ul`
    flex flex-col justify-evenly
    w-4/5 py-3 mx-auto mt-3
    bg-stone-300/30
    rounded-md
    shadow
    backdrop-blur-sm

    md:flex-row
    md:w-full md:py-6
    md:border-t md:border-t-white/30
    md:rounded-none
`;

const DayForecast = tw.li`
    flex items-center
    px-3 py-1.5
    text-white

    md:flex-col
    md:p-0
`;

const WeekForecast = (props) => {
    const { weatherData } = props;

    const getChineseDay = (datetimeString) => {
        const date = new Date(datetimeString.replace(' ', 'T'));
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
            <DayForecast key={weatherForecast.day}>
                <h5 className='flex-grow md:flex-grow-0 md:py-1 font-bold'>{weatherForecast.day}</h5>
                <WeatherIcon weather={weatherForecast['Wx']} />
                <p className='w-18 ml-2 md:py-1'>{weatherForecast['MinT']}° - {weatherForecast['MaxT']}°</p>
            </DayForecast>
        ));
    }

    return (
        <Container>
            <EverydayForecast />
        </Container>
    );
};

export default WeekForecast;