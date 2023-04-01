import React from 'react'
import logo from '../logo.png'
import { Box, Container, Grid } from '@mui/material';
import SongCard from '../components/SongCard';

function Home() {

  const songs = [
    {
      'title': 'nocturne',
      'noteSheets': 6, 
      'composer' : 'chopin'
    },

    {
      'title': 'nocturne',
      'noteSheets': 6, 
      'composer' : 'chopin'
    },

    {
      'title': 'nocturne',
      'noteSheets': 6, 
      'composer' : 'chopin'
    },

    {
      'title': 'nocturne',
      'noteSheets': 6, 
      'composer' : 'chopin'
    },
  ]


  return (
    <Container>
      <img src={logo} alt='logo' style={{ width: '80%', marginBottom:'5%' }} />

      <Grid container spacing={2} sx={{ m: '5 -5%' }}>
        {songs.map(song => (
          <Grid item xs={12} sm={6} key={song.title} sx={{marginBottom:'5%'}}>
            <Box sx={{ px: '5%' }}>
              <SongCard song={song} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home