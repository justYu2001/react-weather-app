import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
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
    const { get, response } = useFetch('./api/taiwan_county.json');

    useEffect(() => {
        const initializeTaiwan = async () => {
            const countyTopology = await get();
            if(response.ok) {
                const taiwanData = topojson.feature(countyTopology, countyTopology.objects['COUNTY_MOI_1090820']);
                setTaiwan(taiwanData);
            }
        };

        initializeTaiwan();
    }, [get, response.ok]);

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