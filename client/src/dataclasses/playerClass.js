import SoundFont from "soundfont-player";
import MidiPlayer from "midi-player-js";
import axios from 'axios'

const SERVER_URL = 'http://localhost:5000'
const RASPI_URL = 'http://192.168.178.59:5005'


export class MidiPlayerClass {
    constructor() {
        this.audioContext = window.AudioContext || window.webkitAudioContext || false;

        this.safeAudioContext = new this.audioContext();
        this.instrument = null;
        this.midi = null;
        this.player = null;

        this.brightnessMultiplier = 1
        this.tempoMultiplier = 1
        this.currentTempo = null

        this.activeNotes = {}
        this.currentTick = null


        this.songTime = null
        this.totalTicks = null
    }


    async setMidi(midiUrl) {
        this.midi = await fetch(midiUrl).then((response) => response.arrayBuffer());
        this.player.loadArrayBuffer(this.midi);
    }

    async setPlayerAndSoundfont() {
        const instrumentUrl = 'acoustic_grand_piano'
        this.instrument = await SoundFont.instrument(
            this.safeAudioContext,
            instrumentUrl,
        );

        this.player = new MidiPlayer.Player((event, tick) => {
            if (event.name === "Note on") {
                this.onNoteOnEvent(event);
            } else if (event.name === "Note off") {
                this.onNoteOffEvent(event);
            } else if (event.name === 'Set Tempo') {
                this.onSetTempoEvent(event);
            }
        });

        this.player.on('fileLoaded', () => {
            this.songTime = this.player.getSongTime()
            this.totalTicks = this.player.totalTicks
            this.activeNotes = this.generateActiveNotes(this.player.getEvents())

        })
    }


    generateActiveNotes(tracks) {
        const activeNotesOnTicks = {}

        tracks.forEach(track => {
            track.forEach(event => {
                if (event.name === 'Note on' && event.velocity !== 0) {
                    if (activeNotesOnTicks[event.tick]) {
                        //tick entry already exists, add noteNumber
                        activeNotesOnTicks[event.tick].push(event.noteNumber)
                    } else if (!activeNotesOnTicks[event.tick]) {
                        activeNotesOnTicks[event.tick] = []
                        //first event on tick, copy last entry, add noteNumber
                        const ticks = Object.keys(activeNotesOnTicks).sort((a, b) => a - b);
                        const index = ticks.findIndex(tick => tick >= event.tick);
                        const tick = ticks[index - 1]
                        //console.log(event, ticks, index, activeNotesOnTicks[index - 1], key)
                        if (index - 1 < 0) {
                            //first event
                            activeNotesOnTicks[event.tick] = []
                            activeNotesOnTicks[event.tick].push(event.noteNumber)

                        } else {
                            activeNotesOnTicks[event.tick] = activeNotesOnTicks[tick].slice()
                            activeNotesOnTicks[event.tick].push(event.noteNumber)
                        }
                    }
                } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
                    if (activeNotesOnTicks[event.tick]) {
                        //tick entry already exists, remove noteNumber
                        let index = activeNotesOnTicks[event.tick].indexOf(event.noteNumber);
                        if (index !== -1) {
                            activeNotesOnTicks[event.tick].splice(index, 1);
                        }
                    } else if (!activeNotesOnTicks[event.tick]) {
                        //first event on tick, copy last entry, remove noteNumber
                        const ticks = Object.keys(activeNotesOnTicks).sort((a, b) => a - b);
                        const index = ticks.findIndex(tick => tick >= event.tick);
                        const tick = ticks[index - 1]
                        if (index - 1 < 0) {
                            //first event
                            activeNotesOnTicks[event.tick] = []
                        } else {
                            activeNotesOnTicks[event.tick] = activeNotesOnTicks[tick].slice()
                            let noteIndex = activeNotesOnTicks[event.tick].indexOf(event.noteNumber);
                            if (index !== -1) {
                                activeNotesOnTicks[event.tick].splice(noteIndex, 1);
                            }
                        }

                    }
                }
            })
        })
        return activeNotesOnTicks
    }

    play() {
        this.player.play()
    }

    pause() {
        this.player.pause()
    }

    getSongTime(player) {
        return Math.floor(player.songTime)
    }

    secondsToMinutesSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
        return `${minutes}:${paddedSeconds}`;
    }

    onSetTempoEvent(event) {
        this.player.tempo = event.data * this.tempoMultiplier
        this.currentTempo = event.data
    }

    onNoteOnEvent(event) {
        if (event.velocity === 0) {
            this.onNoteOffEvent(event);
        } else { 
            this.instrument.play(event.noteName, this.safeAudioContext.currentTime, { gain: event.velocity / 100 })
            this.ledstripUpdate(event.tick)
        }
    }

    onNoteOffEvent(event) {
        this.ledstripUpdate(event.tick)
    }

    countdown(tick) {
        let closestTick = null;
        let smallestDifference = Infinity;

        for (const key in this.activeNotes) {
            if (this.activeNotes[key].length === 0) {
                continue;
            }

            const diff = key - tick;

            if (diff > 0 && diff < smallestDifference) {
                smallestDifference = diff;
                closestTick = key;
            }
        }

        this.ledstripUpdate(closestTick)
    }

    ledstripUpdate(tick) {
        //console.log(tick, this.activeNotes[tick], this.brightnessMultiplier)
        axios.post(`${RASPI_URL}/server/update`, { notes: this.activeNotes[tick], brightness: this.brightnessMultiplier })
            .then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
    }


    ledstripBootup() {
        //console.log('boot up')
        //axios.post(`${SERVER_URL}/bootup`, { notes: this.keysPressed })

    }

    calculateTickFromSec(second) {
        const procent = second / this.songTime
        const tick = Math.floor(procent * this.totalTicks)
        return tick
    }

    skipToTick(tick) {
        this.player.skipToTick(tick)
    }

    playFromTick(tick) {
        this.player.skipToTick(tick)
        this.player.play()
    }

    setTime(time) {
        this.currentTime = time
    }

    setBrightness(value) {
        this.brightnessMultiplier = value
    }

    setTempo(value) {
        this.tempoMultiplier = value
        this.player.tempo = this.currentTempo * this.tempoMultiplier

    }

}