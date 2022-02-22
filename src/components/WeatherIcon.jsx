import React from 'react';

import { ReactComponent as SunnyIcon } from '../assets/icons/sunny-icon.svg';
import { ReactComponent as PartlyClearIcon } from '../assets/icons/partly-clear-icon.svg';
import { ReactComponent as CloudyIcon } from '../assets/icons/cloudy-icon.svg';
import { ReactComponent as RainIcon } from '../assets/icons/rain-icon.svg';
import { ReactComponent as HeavyRainIcon } from '../assets/icons/heavy-rain-icon.svg';

const WeatherIcon = (props) => {
    const { weather } = props;

    if(weather.includes('陣雨')) {
        return <HeavyRainIcon className="w-5 h-5 md:w-11 md:h-11" />;
    } else if(weather.includes('雨')) {
        return <RainIcon className="w-5 h-5 md:w-11 md:h-11" />;
    } else if(weather === '多雲時晴') {
        return <PartlyClearIcon />
    } else if(weather.includes('晴')) {
        return <SunnyIcon className="w-5 h-5 md:w-11 md:h-11" />
    } else {
        return <CloudyIcon className="w-5 h-5 md:w-11 md:h-11" />
    }
};

export default WeatherIcon;