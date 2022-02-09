import React from 'react';
import tw from 'tailwind-styled-components';
import sunnyBackground from './assets/images/sunny.jpg';

const Container = tw.div`
  w-screen h-screen
  bg-[image:var(--image-url)] bg-cover
`;

const App = () => {
  return (
    <Container style={{'--image-url': `url(${sunnyBackground})` }} />
  );
};

export default App;