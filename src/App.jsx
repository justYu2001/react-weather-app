import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as topojson from 'topojson-client';
import tw from 'tailwind-styled-components';
import sunnyBackground from './assets/images/sunny.jpg';
import rainyBackground from './assets/images/rainy.jpg';
import cloudyBackground from './assets/images/cloudy.jpg';
import { ReactComponent as SettingIcon } from './assets/icons/setting-icon.svg';

import CountySettingModal from './components/CountySettingModal';
import TodayForecast from './components/TodayForecast';
import WeekForecast from './components/WeekForecast';

const Container = tw.div`
    flex flex-col justify-between
    w-screen h-screen
    bg-[image:var(--image-url)] bg-cover
    transition-all ease-linear duration-300
`;

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
                setWeatherData(weatherElement)
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

        const setBackground = () => {
            const todayWeatherDescription = getTodayWeatherDescription();
            
            const setBackgroundUrl = (background) => {
                document.documentElement.style.setProperty('--image-url', `url(${background})`);
            }

            if(todayWeatherDescription.includes('雨')) {
                setBackgroundUrl(rainyBackground);
            } else if(todayWeatherDescription.includes('晴')) {
                setBackgroundUrl(sunnyBackground);
            } else {
                setBackgroundUrl(cloudyBackground);
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
                <div className='flex justify-between p-8'>
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