import React from 'react';
import tw from 'tailwind-styled-components';

const Card = tw.div`
  w-96 py-8 px-4
  bg-gray-50
  shadow-md
`;

const App = () => {
  return (
    <Card>
      <h1 className='text-3xl'>Weather</h1>
    </Card>
  );
};

export default App;