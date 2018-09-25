import React, { Component } from 'react'
import './App.css'
import { CirclePicker } from 'react-color'
import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyD1QH9HTSDghcCV-9g76L2MZ7iHeCmrAEI',
  authDomain: 'funfunpixels.firebaseapp.com',
  databaseURL: 'https://funfunpixels.firebaseio.com',
  storageBucket: '',
  projectId: 'funfunpixels',
}
firebase.initializeApp(config)

const firestore = firebase.firestore()
firestore.settings({timestampsInSnapshots: true})

const PIXEL_SIZE = 10

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pixels: [],
    }

    this.onHandleClick = this.onHandleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)

    firestore.collection('pixels').onSnapshot(col => this.setState({
        pixels: col.docs.map(doc => doc.data()),
        pickerCoordinate: null,
      }),
    )
  }

  onHandleClick (e) {
    const pickerCoordinate = {
      x: Math.floor(e.clientX / PIXEL_SIZE),
      y: Math.floor(e.clientY / PIXEL_SIZE),
    }

    this.setState({pickerCoordinate})
  }

  handleChange (color, e) {
    e.preventDefault()
    e.stopPropagation()

    const doc = {
      ...this.state.pickerCoordinate,
      color: color.hex,
    }

    firestore.
      collection('pixels').
      add(doc).
      then(res => console.log(res)).catch(err => console.log('err', err))
  }

  render () {
    return (
      <div id="pixels"
           style={{
             position: 'absolute',
             width: '100%',
             height: '100%',
           }}
           onClick={this.onHandleClick}
      >
        {this.state.pixels.map(pixel => <div style={{
          position: 'absolute',
          left: pixel.x * PIXEL_SIZE,
          top: pixel.y * PIXEL_SIZE,
          width: PIXEL_SIZE,
          height: PIXEL_SIZE,
          backgroundColor: pixel.color,
        }}/>)}
        {this.state.pickerCoordinate && <div style={{
          position: 'absolute',
          left: this.state.pickerCoordinate.x * PIXEL_SIZE,
          top: this.state.pickerCoordinate.y * PIXEL_SIZE,
        }}>
          <CirclePicker onChange={this.handleChange}/>
        </div>
        }
      </div>
    )
  }
}

export default App
