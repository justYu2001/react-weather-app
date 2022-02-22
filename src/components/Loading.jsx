import React from 'react';
import tw from 'tailwind-styled-components';

import { ReactComponent as SunnyIcon } from '../assets/icons/sunny-icon.svg';

const Container = tw.div`
    fixed inset-0 z-10
    flex justify-center items-center
    bg-white
    transition-opacity duration-300

    ${(props) => props.$show ? 'opacity-100' : 'opacity-0'}
    ${(props) => props.$show ? '' : 'pointer-events-none'}
    ${(props) => props.$show ? '' : 'animate-fadeout'}
`;

const Spinner = tw.div`
    w-8 h-8 mt-3
    border-4 border-t-cyan-400 border-b-cyan-400 border-l-cyan-400 border-r-transparent
    rounded-full
    animate-spin
`;

const Loading = (props) => {
    const { loading } = props;

    return (
        <Container $show={loading}>
            <div className='flex flex-col items-center animate-fade-in'>
                <SunnyIcon />
                <p className='mt-2 text-cyan-400 text-3xl'>Yu 天氣預報</p>
                <Spinner />
            </div>
        </Container>
    );
};

export default Loading;