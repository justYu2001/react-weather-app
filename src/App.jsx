import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as topojson from 'topojson-client';
import tw from 'tailwind-styled-components';
import sunnyLargeBackground from './assets/images/sunny-lg.jpg';
import rainyLargeBackground from './assets/images/rainy-lg.jpg';
import cloudyLargeBackground from './assets/images/cloudy-lg.jpg';
import sunnyMediumBackground from './assets/images/sunny-md.jpg';
import rainyMediumBackground from './assets/images/rainy-md.jpg';
import cloudyMediumBackground from './assets/images/cloudy-md.jpg';
import { ReactComponent as SettingIcon } from './assets/icons/setting-icon.svg';

import CountySettingModal from './components/CountySettingModal';
import TodayForecast from './components/TodayForecast';
import WeekForecast from './components/WeekForecast';

const Container = tw.div`
    flex flex-col
    w-screen h-screen
    bg-[image:var(--image-url)] bg-cover
    transition-all ease-linear duration-300

    md:justify-between
`;

const backgrounds = {
    lg: {
        rainy: rainyLargeBackground,
        sunny: sunnyLargeBackground,
        cloudy: cloudyLargeBackground,
    },
    md: {
        rainy: rainyMediumBackground,
        sunny: sunnyMediumBackground,
        cloudy: cloudyMediumBackground,
    },
};

const getCheckpoint = () => {
    const windowWidth = window.innerWidth;
    if(windowWidth >= 1280) {
        return 'lg';
    } else {
        return 'md';
    }
};

const App = () => {
    const [taiwan, setTaiwan] = useState({
        features: [],
    });

    useEffect(() => {
        const initializeTaiwan = async () => {
            try {
                const response = await axios.get('./api/taiwan_county.json');
                const countyTopology = response.data;
                const taiwanData = topojson.feature(countyTopology, countyTopology.objects['COUNTY_MOI_1090820']);
                setTaiwan(taiwanData);
            } catch (error) {
                console.error(error);
            }
        };

        initializeTaiwan();
    }, []);

    const [isCountySettingModalOpen, setIsCountySettingModalOpen] = useState(false);

    const openCountySettingModal = () => setIsCountySettingModalOpen(true);

    const handleCountySettingModalClose = () => setIsCountySettingModalOpen(false);

    const [county, setCounty] = useState('臺北市');

    const [weatherData, setWeatherData] = useState([]);

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
                const { weatherElement } = response.data.records.locations[0].location[0];
                setWeatherData(weatherElement);
            } catch (error) {
                console.error(error);
            } 
        };

        fetchWeatherData();
    }, [county]);

    useEffect(() => {
        const getTodayWeatherDescription = () => {
            if(weatherData.length === 0){
                return '晴';
            }

            const weatherDescriptionList = weatherData.find((weatherElement) => {
                return weatherElement.elementName === 'Wx';
            }).time;

            const todayWeatherDescription = weatherDescriptionList[0].elementValue[0].value;
            return todayWeatherDescription;
        }

        const setBackgroundUrl = (background) => {
            document.documentElement.style.setProperty('--image-url', `url(${background})`);
        }

        const setBackground = () => {
            const todayWeatherDescription = getTodayWeatherDescription();

            const checkpoint = getCheckpoint();
            const background = backgrounds[checkpoint];

            if(todayWeatherDescription.includes('雨')) {
                setBackgroundUrl(background.rainy);
            } else if(todayWeatherDescription.includes('晴')) {
                setBackgroundUrl(background.sunny);
            } else {
                setBackgroundUrl(background.cloudy);
            }
        };

        setBackground();
    }, [weatherData]);

    return (
        <>
            <CountySettingModal 
                taiwan={taiwan}
                isOpen={isCountySettingModalOpen} 
                onClose={handleCountySettingModalClose}
                county={county}
                setCounty={setCounty}
            />
            <Container>
                <div className='flex justify-between p-4 md:p-8'>
                    <TodayForecast weatherData={weatherData} county={county} />
                    <SettingIcon
                        className='w-6 h-6 text-white cursor-pointer'
                        onClick={openCountySettingModal}
                    />
                </div>
                <WeekForecast weatherData={weatherData} />
            </Container>
        </>
    );
};

export default App;