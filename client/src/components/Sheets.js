import { useState, useEffect } from 'react'
import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import CircleIcon from '@mui/icons-material/Circle';

function Sheets({ noteSheetsNumber, title }) {
    const [currentSheet, setCurrentSheet] = useState('1')
    
    const updateSheetNumberValue = (event, newValue) => {
        setCurrentSheet(newValue.toString())
    }

    const [picturesSrc, setPicturesSrc] = useState({})
    const [sheetNumbers, setSheetNumbers] = useState([])
    useEffect(() => {
        const obj = {};
        for (let i = 1; i <= 6; i++) {
            const picture = require(`../noteSheets/${title}/${i}.jpg`);
            obj[i.toString()] = picture;
        }
        setPicturesSrc(obj)
        setSheetNumbers(Array.from({ length: noteSheetsNumber }, (_, i) => i + 1));
    }, []);


    return (
        <div>
            <Box sx={{ width: '100%', height: '950px' }}>
                <TabContext value={currentSheet}>
                    {sheetNumbers.map(sheet => {
                        return (
                            <TabPanel key={sheet} value={sheet.toString()}>
                                <img src={picturesSrc[sheet]} alt='music sheet' style={{ width: '100%', height:'750px' }} />
                            </TabPanel>
                        )
                    })}

                    <Box>
                        <TabList onChange={updateSheetNumberValue} centered>
                            {sheetNumbers.map(sheet => {
                                return (
                                    <Tab key={sheet} value={sheet.toString()} icon={<CircleIcon />} />
                                )
                            })}
                        </TabList>
                    </Box>

                </TabContext>
            </Box>

        </div>
    )
}

export default Sheets

