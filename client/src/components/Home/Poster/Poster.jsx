import React from 'react';
import Image from './poster.png'

const Poster = () => {
    return (
        <div className='w-full h-auto py-6 flex justify-center items-center'>
            <img src={Image} alt="Poster" />
        </div>
    );
};

export default Poster;