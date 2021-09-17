import { useEffect, useRef, useState } from 'react'
//import logo from './logo.svg';
import './App.css';

import stylesFile from './components/File.module.scss'

import { ProtoHttpToWs } from './lib/util'
import { getServer, getConfig, getRoom } from './lib/api'
import LibFgg from './libfgg/libfgg'
import log from 'loglevel'
import history from 'history/browser'

import Address from './components/Address'
import File from './components/File'
import Progress from './components/Progress'
import Qrcode from './components/QRCode'

const fgg = new LibFgg()

function App() {
  const [address, setAddress] = useState<string>(document.location.href)

  let progress = 0
  let total = 10
  const [percent, setPercent] = useState<number>(0)
  const [recver, setRecver] = useState<boolean>(false)

  const refIce = useRef<RTCIceServer[]>([])

  fgg.onPreTran = (meta: any) => {
    total = meta.size
  }

  fgg.onRecvFile = () => setRecver(true)

  fgg.tran.onProgress = (c: number) => {
    progress += c
    log.debug(progress)
    setPercent(progress / total)
  }

  const getfile = function() {
    fgg.useWebRTC({
      iceServers: refIce.current,
    }, () => {

      // TODO:
      // Need Wait to 1s
      setTimeout(() => {
        fgg.getfile()
      }, 1000)
    })
    fgg.runWebRTC()
  }
  const handleFile = function(files: FileList) {
    fgg.useWebRTC({
      iceServers: refIce.current,
    }, () => {})

    fgg.sendFile(files[0])
  }

  const init = async function() {
    refIce.current = await getConfig()

    const room = await getRoom()
    console.log(room)
    history.push(room)
    setAddress(document.location.origin + '/' + room)
    const addr = getServer() + room
    fgg.useWebsocket(ProtoHttpToWs(addr))
  }

  useEffect(() => {
    init()
  }, [])

  // <img src={logo} className="App-logo" alt="logo" />
  return (
      <div className="App">
        <header className="App-header">
        <div className="App-card">
          <Qrcode address={ address }></Qrcode>
          <Address address={ address }></Address>
          <Progress percent={ percent }></Progress>

          { recver
            ? <label className={ stylesFile.button } onClick={ () => { getfile() } } >GetFile</label>
            : <File handleFile={ (files: any) => { handleFile(files) } } ></File>
          }
        </div>
        </header>
      </div>
    )
}

export default App;
