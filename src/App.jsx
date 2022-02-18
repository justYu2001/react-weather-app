import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as topojson from 'topojson-client';
import tw from 'tailwind-styled-components';
import sunnyBackground from './assets/images/sunny.jpg';
import { ReactComponent as SettingIcon } from './assets/icons/setting-icon.svg';

import CountySettingModal from './components/CountySettingModal';

const Container = tw.div`
    w-screen h-screen
    bg-[image:var(--image-url)] bg-cover
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


    return (
        <>
            <CountySettingModal 
                taiwan={taiwan}
                isOpen={isCountySettingModalOpen} 
                onClose={handleCountySettingModalClose}
                county={county}
                setCounty={setCounty}
            />
            <Container style={{'--image-url': `url(${sunnyBackground})` }}>
                <div className='flex justify-between p-8'>
                    <p className='text-white text-3xl'>{county}</p>
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