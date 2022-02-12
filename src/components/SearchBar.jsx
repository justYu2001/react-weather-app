import React, { useState, useRef, useEffect } from 'react';
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
    ${props => props.$isSelected ? 'bg-slate-200' : ''}
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

    const [isComposing, setIsComposing] = useState(false);

    const [currentResultIndex, setCurrentResultIndex] = useState(-1);

    const handleKeywordInputKeyArrowUp = () => {
        const keywordInputElement = keywordInputRef.current;

        if(currentResultIndex > -1 && isComposing === false) {
            const newResultIndex = currentResultIndex - 1;
            setCurrentResultIndex(newResultIndex);
            if(newResultIndex > -1) {
                keywordInputElement.value = resultList[newResultIndex].district;
            }
        }
    };

    const handleKeywordInputKeyArrowDown = () => {
        const keywordInputElement = keywordInputRef.current;

        if(currentResultIndex < resultList.length - 1 && isComposing === false) {
            const newResultIndex = currentResultIndex + 1;
            setCurrentResultIndex(newResultIndex);
            keywordInputElement.value = resultList[newResultIndex].district;
        }
    };

    const handleKeywordInputKeyEnter = () => {
        if(isComposing === false) {
            const keywordInputElement = keywordInputRef.current;

            if(currentResultIndex > -1) {
                handleResultItemClick(resultList[currentResultIndex])();
            } else if(keywordInputElement.value.length > 1 && resultList.length > 0) {
                handleResultItemClick(resultList[0])();
            }

            setCurrentResultIndex(-1);
            keywordInputElement.blur();
        }
    };

    const handleKeywordInputKeyDown = (event) => {
        const keywordInputKeyDownHandler = {
            ArrowDown: handleKeywordInputKeyArrowDown,
            ArrowUp: handleKeywordInputKeyArrowUp,
            Enter: handleKeywordInputKeyEnter,
        }

        if(keywordInputKeyDownHandler[event.key]) {
            keywordInputKeyDownHandler[event.key]();
        }
    }

    useEffect(() => {
        /*
         * Fix the cursor at the last position
         * when using the up and down key to select a result.
         */

        keywordInputRef.current.setSelectionRange(-1, -1);
    });

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
                    $isSelected={currentResultIndex === index}
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
            <KeywordInput 
                ref={keywordInputRef} 
                onInput={handleKeywordInput}
                onBlur={() => setCurrentResultIndex(-1)}
                onKeyDown={handleKeywordInputKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
            />
            <ResultList $numberOfResult={resultList.length}>
                <ResultListItems />
            </ResultList>
        </div>
    );
};

export default SearchBar;