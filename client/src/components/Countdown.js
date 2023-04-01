import { useEffect, useState } from 'react'
import { CircularProgress, Box, Typography } from '@mui/material';


function Countdown() {
    const [count, setCount] = useState(100)
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => (prevCount === 0) ? 100 : prevCount - 20)
            //setCount((prevCount) => (prevCount >= 100) ? 0 : prevCount + 20)
        }, 1000)
        return () => {
            clearInterval(timer);
        };
    }, [])




    //if (countingDown) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={count} size={100} thickness={4} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h3" component="div" color="text.secondary" >
                        {5 * (count / 100)}
                    </Typography>
                </Box>
            </Box>
        )
    //}
}

export default Countdown


