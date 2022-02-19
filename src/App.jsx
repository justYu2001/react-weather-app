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

const Container = tw.div`
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

    const [weatherDescription, setWeatherDescription] = useState('晴');

    useEffect(() => {
        const setBackground = () => {
            const setBackgroundUrl = (background) => {
                document.documentElement.style.setProperty('--image-url', `url(${background})`);
            }

            if(weatherDescription.includes('雨')) {
                setBackgroundUrl(rainyBackground);
            } else if(weatherDescription.includes('晴')) {
                setBackgroundUrl(sunnyBackground);
            } else {
                setBackgroundUrl(cloudyBackground);
            }
        };

        setBackground();
    }, [weatherDescription]);

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
                    <TodayForecast county={county} onCountyChange={setWeatherDescription} />
                    <SettingIcon
                        className='w-6 h-6 text-white cursor-pointer'
                        onClick={openCountySettingModal}
                    />
                </div>
            </Container>
        </>
    );
};

export default App;