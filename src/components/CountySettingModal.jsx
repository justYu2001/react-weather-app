import React, { useRef, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import tw from 'tailwind-styled-components';
import TaiwanMap from './TaiwanMap';
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg';

const CurrentCounty = tw.p`
    font-bold text-3xl

    md:mt-2 md:-m-1
    md:text-5xl
`;

const CountySettingModal = (props) => {
    const { isOpen, onClose, taiwan, county, setCounty } = props;

    const closeButtonRef = useRef(null);

    return (
        <Transition
            show={isOpen}
            as={Fragment}
        >
            <Dialog
                as="div"
                initialFocus={closeButtonRef}
                onClose={onClose}
                className="fixed inset-0 flex justify-center items-center"
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="absolute inset-0 -z-10 bg-black/30" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transform transition duration-300"
                    enterFrom="scale-0"
                    enterTo="scale-100"
                    leave="transform transition duration-300"
                    leaveFrom="scale-100"
                    leaveTo="scale-0"
                >
                    <div className='relative w-4/5 h-1/2 md:h-3/5 lg:h-4/5 bg-white rounded-md'>
                        <div className='absolute top-0 left-0 p-3 md:p-6'>
                            <Dialog.Title className="md:text-xl">目前設定地區</Dialog.Title>
                            <CurrentCounty>{county}</CurrentCounty>
                        </div>
                        <div className='absolute top-0 right-0 p-3 md:p-6'>
                            <CloseIcon 
                                ref={closeButtonRef} 
                                className="w-10 h-10 cursor-pointer hover:fill-red-500"
                                onClick={onClose} 
                            />
                        </div>
                        <TaiwanMap taiwan={taiwan} onCountyClick={setCounty} onClose={onClose}/>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

export default CountySettingModal;