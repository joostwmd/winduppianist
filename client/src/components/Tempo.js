import { useState } from 'react'
import { Slider, Box, Typography } from '@mui/material';
import { Speed } from '@mui/icons-material';

function Tempo({player}) {

    const [tempo, setTempo] = useState(100)

    const handleTempoChange = (event, newValue) => {
        setTempo(newValue)
        player.setTempo(newValue / 100)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'space-between', height: '800px'}}>
            <Speed sx={{ transform: 'scale(2)' }}/>
            <Box sx={{ height: '85%' }}>
                <Slider
                    sx={{
                        '& input[type="range"]': {
                            WebkitAppearance: 'slider-vertical',
                        },
                    }}
                    orientation="vertical"
                    defaultValue={100}
                    onChange={handleTempoChange}
                    min={1}
                    max={100}
                    step={1}
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
                {tempo}
            </Typography>
        </Box>
    )
}

export default Tempo