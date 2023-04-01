import { useState, useEffect } from "react";
import { Slider, IconButton, Box, Container, Typography, CircularProgress } from '@mui/material';
import { PlayArrow, Pause } from "@mui/icons-material";

function Player({ player, title, composer }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [loopRange, setLoopRange] = useState([0, player.getSongTime(player)]);
    const [count, setCount] = useState(100)
    const [status, setStatus] = useState('pause')

    const handleTimeSliderChange = (event, newValue) => {
        setCurrentTime(newValue);
    };

    const handleTimeSliderChangeCommitted = (event, newValue) => {
        setCurrentTime(newValue);
        player.skipToTick(player.calculateTickFromSec(newValue))
    };

    const handleLoopSliderChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setLoopRange([Math.min(newValue[0], loopRange[1] - 1), loopRange[1]]);
        } else {
            setLoopRange([loopRange[0], Math.max(newValue[1], loopRange[0] + 1)]);
        }
    };

    const handlePlayPause = () => {
        if (status === 'pause') {
            setStatus('countdown')
        } else if (status === 'play') {
            setStatus('pause')
            player.pause()
        }
    }

    useEffect(() => {
        if (status === 'countdown') {
            player.countdown(player.calculateTickFromSec(currentTime))
            const timer = setInterval(() => {
                if (count !== 0) {
                    setCount((prevCount) => prevCount - 20)
                } else if (count === 0) {
                    player.skipToTick(player.calculateTickFromSec(currentTime))
                    setStatus('play')
                    setCount(100)
                }
            }, 1000)

            return () => {
                clearInterval(timer);
            };
        }
    }, [status, count])

    useEffect(() => {
        const timer = setInterval(() => {
            if (status !== 'play') {
                return;
            }

            if (currentTime >= loopRange[1]) {
                setStatus('countdown')
                setCurrentTime(loopRange[0]);
                player.pause()
            } else {
                setCurrentTime((currentTime) => currentTime + 1);
            }
        }, 1000 * (1 / player.tempoMultiplier));

        return () => {
            clearInterval(timer);
        };
    }, [status, currentTime, loopRange, player]);


    return (
        <Container sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '90%', marginLeft: '3%',  }}>
                <Box sx={{ width: '100%', marginBottom: '15px' }}>
                    <Box display='flex' justifyContent='space-between' sx={{ width: '85%' }}>
                        <Typography variant="h5">{player.secondsToMinutesSeconds(Math.floor(currentTime))}</Typography>
                        <Typography variant="h6">{title} - {composer}</Typography>
                        <Typography variant="h5">{player.secondsToMinutesSeconds(Math.floor(player.songTime))}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Slider
                            min={0}
                            max={Math.floor(player.songTime)}
                            value={currentTime}
                            onChange={handleTimeSliderChange}
                            onChangeCommitted={handleTimeSliderChangeCommitted}
                            sx={{ width: '85%' }}
                            step={1}
                        />
                    </Box>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Box display='flex' justifyContent='space-between' sx={{ width: '85%' }}>
                        <Typography variant="h5">{player.secondsToMinutesSeconds(loopRange[0])}</Typography>
                        <Typography variant="h5">{player.secondsToMinutesSeconds(loopRange[1])}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Slider
                            min={0}
                            max={Math.floor(player.songTime)}
                            value={loopRange}
                            onChange={handleLoopSliderChange}
                            step={1}
                            disableSwap
                            sx={{ width: '85%' }}
                        />
                    </Box>
                </Box>
            </Box>


            <Container sx={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {status === 'play' && (
                    <IconButton onClick={() => { handlePlayPause() }} sx={{ transform: 'scale(4)' }}>
                        <Pause />
                    </IconButton>
                )}


                {status === 'countdown' && (
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
                )}

                {status === 'pause' && (
                    <IconButton onClick={() => { handlePlayPause() }} sx={{ transform: 'scale(4)' }}>
                        <PlayArrow />
                    </IconButton>
                )}
            </Container>
        </Container>
    );
}

export default Player

