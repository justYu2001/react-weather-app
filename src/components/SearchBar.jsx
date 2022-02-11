import React, { useState, useRef } from 'react';
import tw from 'tailwind-styled-components';

const KeywordInput = tw.input`
    peer
    relative z-10
    w-full py-1 px-3
    border-2 border-white/50 rounded-full
    bg-gray-100/25
    text-white text-xl tracking-wide
    outline-none

    focus:border-white
    focus:bg-white
    focus:text-black
`;

const ResultList = tw.ul`
    absolute top-10 left-0 right-0
    hidden
    py-5
    rounded-b-3xl shadow-md
    bg-white

    ${props => props.$numberOfResult === 0 ? '' : 'hover:block'}
    ${props => props.$numberOfResult === 0 ? '' : 'peer-focus:block'}

    before:content-['']
    before:block
    before:h-px
    before:bg-gray-300

`;

const ResultListItem = tw.li`
    flex justify-between items-center
    py-1 px-3.5
    text-xl tracking-wide
    cursor-pointer

    hover:bg-slate-200
`;

const SearchBar = (props) => {
    const [keyword, setKeyword] = useState('');

    const [resultList, setResultList] = useState([]);

    const toTraditionalChinese = (string) => {
        const dictionary = {
            '台': '臺',
        };
        
        let newString = string;

        for(const key in dictionary) {
            if(string.includes(key)) {
                newString = newString.replace(key, dictionary[key]);
            }
        }

        return newString;
    }

    const keywordInputRef = useRef(null);

    const handleKeywordInput = () => {
        const keywordInputElement = keywordInputRef.current;
        const newKeyword = toTraditionalChinese(keywordInputElement.value);
        setKeyword(newKeyword);
        
        if(newKeyword === '') {
            setResultList([]);
            return;
        }
        
        const { districtData } = props;

        let districtsList = [];

        for (const key in districtData) {
            const { districts } = districtData[key];

            districts?.forEach((district) => {
                if(districtsList.length < 5 && district.includes(newKeyword)) {
                    districtsList.push({
                        district,
                        city: key,
                    });
                }
            });
        }

        setResultList(districtsList);
    };

    const handleResultItemClick = (location) => {
        return () => {
            const { setCurrentLocation } = props;
            setCurrentLocation(location);
            keywordInputRef.current.value = '';
            setResultList([]);
        };
    };

    const ResultListItems = () => {
        return resultList.map((result, index) => {
            const words = result.district.split(keyword);
            return (
                <ResultListItem 
                    key={`${result.district}${index}`} 
                    onClick={handleResultItemClick(result)}
                >
                    <div>
                        {words[0]}<span className='text-cyan-500'>{keyword}</span>{words[1]}
                    </div>
                    <div className='pr-1 text-gray-500 text-base tracking-wide'>{result.city}</div>
                </ResultListItem>
            );
        });
    }

    return (
        <div className='relative w-2/5 py-5 m-auto'>
            <KeywordInput ref={keywordInputRef} onInput={handleKeywordInput} />
            <ResultList $numberOfResult={resultList.length}>
                <ResultListItems />
            </ResultList>
        </div>
    );
};

export default SearchBar;