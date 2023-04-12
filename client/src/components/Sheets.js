import { useState, useEffect } from 'react'
import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import CircleIcon from '@mui/icons-material/Circle';

function Sheets({ noteSheetsNumber, title }) {
    const [images, setImages] = useState(null)
    const [currentSheet, setCurrentSheet] = useState('1')

    const updateSheetNumberValue = (event, newValue) => {
        setCurrentSheet(newValue.toString())
    }

    useEffect(() => {
        const importImages = async () => {
            const promises = {};
            for (let i = 1; i <= 6; i++) {
                promises[i.toString()] = import(`../notesheets/${title}/${i}.jpg`).then((picture) => {
                    return picture.default;
                });
            }

            const importedImages = await Promise.allSettled(Object.values(promises));
            const fulfilledPromises = importedImages.reduce((obj, promise, index) => {
                if (promise.status === 'fulfilled') {
                    obj[(index + 1).toString()] = promise.value;
                }
                return obj;
            }, {});
            return fulfilledPromises
        };

        importImages().then((res => {
            setImages(res)
        }))
    }, [noteSheetsNumber, title]);


    if (images) {
        return (
            <div>
                <Box sx={{ width: '100%', height: '950px' }}>
                    <TabContext value={currentSheet}>

                        {Object.keys(images).map(key => {
                            return (
                                <TabPanel key={key} value={key.toString()}>
                                    <img src={images[key]} alt='sheet' style={{ width: '100%', height: '750px' }} />
                                </TabPanel>
                            )
                        })}



                        <Box>
                            <TabList onChange={updateSheetNumberValue} centered>
                                {Object.keys(images).map(sheet => {
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
}

export default Sheets

