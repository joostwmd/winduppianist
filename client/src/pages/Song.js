import { useEffect, useState } from 'react'
import axios from 'axios';
import { Grid, Container, CircularProgress } from '@mui/material';

import Player from '../components/Player'
import Sheets from '../components/Sheets'
import Brightness from '../components/Brightness'
import Tempo from '../components/Tempo'


import { MidiPlayerClass } from '../dataclasses/playerClass';




function Song() {

    const SERVER_URL = 'http://localhost:5005'
    const [player, setPlayer] = useState(null)
    const [playerInitialized, setPlayerInitialized] = useState(false)
    const [title, setTitle] = useState('')
    const [composer, setComposer] = useState('')
    const [noteSheetsNumber, setNotesSheetsNumber] = useState(Number)


    //wait
    useEffect(() => {
        const delay = setTimeout(() => {
            setPlayerInitialized(true);
        }, 2500);

        return () => clearTimeout(delay);
    }, []);


    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const title = searchParams.get('title');
        const composer = searchParams.get('composer');
        const noteSheets = searchParams.get('noteSheets');

        setTitle(title)
        setComposer(composer)
        setNotesSheetsNumber(Number(noteSheets))

        const initMidiPlayer = async () => {
            const midiPlayer = await new MidiPlayerClass();
            return midiPlayer
        };

        initMidiPlayer().then(initializedPlayer => {
            setPlayer(initializedPlayer)
            initializedPlayer.ledstripBootup()
            initializedPlayer.setPlayerAndSoundfont().then(() => {
                initializedPlayer.setMidi(`/midiFiles/${title}.mid`)
            })
        })

    }, []);

   
    if (playerInitialized) {
        return (
            <Container>
                <Grid container spacing={0} style={{ marginTop: '50px', height: '80vh', width: '90vw' }}>
                    <Grid item xs={2} style={{ height: '100%', width: '5%', margin: '0 0 0 0%' }}>
                        <Brightness player={player} style={{ height: '100%' }} />
                    </Grid>
                    <Grid item xs={8} style={{ height: '100%', width: '80%' }}>
                        <Sheets noteSheetsNumber={noteSheetsNumber} title={title} style={{ height: '100%' }} />
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%', width: '5%', margin: '0 0% 0 0' }}>
                        <Tempo player={player} style={{ height: '100%' }} />
                    </Grid>
                </Grid>

                <Container sx={{ width: '90%', height: '10%', position: 'absolute', left: '7%', right: '7%' }}>
                    <Player player={player} title={title} composer={composer} />
                </Container>

            </Container>
        )
    } else {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={200} thickness={5} />
            </Container>
        )
    }
}

export default Song