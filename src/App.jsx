import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import tw from 'tailwind-styled-components';
import sunnyBackground from './assets/images/sunny.jpg';
import SearchBar from './components/SearchBar';

const Container = tw.div`
    w-screen h-screen
    bg-[image:var(--image-url)] bg-cover
`;

const App = () => {
    const districtDataURL = './api/district.json';
    const { get, response } = useFetch(districtDataURL);

    const [districtData, setDistrictData] = useState({});

    useEffect(() => {
        const initializeDistrictData = async () => {
            const data = await get();
            if(response.ok) {
                setDistrictData(data);
            }
        }

        initializeDistrictData();
    }, [get, response.ok]);

    const [currentLocation, setCurrentLocation] = useState({
        city: '臺北市',
        district: '臺北市',
    });

    return (
    <Container style={{'--image-url': `url(${sunnyBackground})` }}>
        <SearchBar districtData={districtData} setCurrentLocation={setCurrentLocation}/>
        <div className='p-10 text-white text-3xl'>{currentLocation.district}</div>
    </Container>
    );
};

export default App;