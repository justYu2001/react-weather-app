import React from 'react';
import { Mercator, Graticule } from '@visx/geo';
import { ParentSize } from '@visx/responsive';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';

import { useTranslation } from 'react-i18next';

const TaiwanMap = (props) => {
    const { taiwan, onCountyClick, onClose } = props;

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
      } = useTooltip();

    const tooltipStyle = {
        ...defaultStyles,
        backgroundColor: '#000',
    };

    const handleMouseMove = (feature) => {
        return (event) => {
            const county = feature.properties['COUNTYNAME'];

            const rect = event.target.ownerSVGElement.getBoundingClientRect();

            const x = event.clientX - rect.x - 38;
            const y = event.clientY - rect.y - 38;

            showTooltip({
                tooltipLeft: x,
                tooltipTop: y,
                tooltipData: county,
            });
        };
    }

    const handleClick = () => {
        onCountyClick(tooltipData);
        onClose();
    };

    const breakPoints = {
        md: 700,
        sm: 512,
    }

    const getScale = (width) => {

        if(width > breakPoints.md) {
            return 8400;
        } else if(width > breakPoints.sm) {
            return 8000;
        } else {
            return 3800;
        }
    };

    const getTranslate = (width, height) => {
        if(width > breakPoints.md) {
            return [width / 1.55, height / 2.5];
        } else if(width > breakPoints.sm) {
            return [width / 1.48, height / 2.3];
        } else {
            return [width / 1.5, height / 2];
        }
    }

    const { t } = useTranslation();

    return (
        <ParentSize>
            {({width, height}) => (
                <>
                    <svg width={width} height={height}>
                        <rect x={0} y={0} width={width} height={height} fill={'#fff'} rx={20}/>
                        <Mercator
                            data={taiwan.features}
                            translate={getTranslate(width, height)}
                            scale={getScale(width)}
                            center={[120.9738819, 23.97565]}
                        >
                            {(mercator) => (
                                <g>
                                    <Graticule graticule={(g) => mercator.path(g) || ''} stroke="#fff" />
                                    {mercator.features.map(({ feature, path }, i) => (
                                        <path
                                            key={`map-feature-${i}`}
                                            d={path || ''}
                                            fill={"rgb(34 211 238)"}
                                            stroke={"#fff"}
                                            strokeWidth={0.5}
                                            className="cursor-pointer hover:fill-cyan-300"
                                            onClick={handleClick}
                                            onMouseMove={handleMouseMove(feature)}
                                            onMouseOut={hideTooltip}
                                        />
                                    ))}
                                </g>
                            )}
                        </Mercator>
                    </svg>
                    {tooltipOpen &&
                        <Tooltip
                            top={tooltipTop}
                            left={tooltipLeft}
                            style={tooltipStyle}
                        >
                            <p className='text-white'>{t(tooltipData)}</p>
                        </Tooltip>
                    }
                </>
            )}
        </ParentSize>
    );
};

export default TaiwanMap;