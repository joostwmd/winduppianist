import { useState } from 'react'
import { Slider, Box, Typography } from '@mui/material';
import { BrightnessHigh } from '@mui/icons-material';


function Brightness({player}) {

    const [brightness, setBrightness] = useState(100)

    const handleBrightnessSliderChange = (event, newValue) => {
        setBrightness(newValue)
        player.setBrightness(newValue / 100)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '800px' }}>
            <BrightnessHigh sx={{ transform: 'scale(2)' }}/>
            <Box sx={{ height: '85%' }}>
                <Slider
                    sx={{
                        '& input[type="range"]': {
                            WebkitAppearance: 'slider-vertical',
                        },
                    }}
                    orientation="vertical"
                    defaultValue={100}
                    onChange={handleBrightnessSliderChange}
                />
            </Box>
            <Typography
                variant="h5"
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(270deg)'
                }}
            >
                {brightness}
            </Typography>
        </Box>
    );
}

export default Brightness