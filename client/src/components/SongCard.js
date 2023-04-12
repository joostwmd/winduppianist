import { useEffect, useState } from 'react'
import { Card, IconButton, Box, Container, Typography, CircularProgress, CardActionArea } from '@mui/material';


function SongCard({ song }) {
  const [coverImg, setCoverImg] = useState('')

  const handleSongCardClick = () => {
    const params = new URLSearchParams(song);
    window.location.replace(`/song?${params.toString()}`);
  }

  useEffect(() => {
    const importImg = async () => {
      
      try {
        const img = await import(`../notesheets/${song.title}/1.jpg`)
        setCoverImg(img.default)
      } catch (error) {
        console.log(error)
      }
    }
    importImg()
  }, [song.title])

  return (
    <Card onClick={() => {handleSongCardClick()}}>
      <CardActionArea>
        <Typography variant='h4'>{song.title}</Typography>
        <Typography variant='h5'>{song.composer}</Typography>
        {coverImg && <img src={coverImg} alt={song.title} style={{ width: '100%' }} />}
      </CardActionArea>
    </Card>
  )
}

export default SongCard