import React from 'react'
import ReactDOM from 'react-dom/client'
import {GoldMetallic} from '@tests/colors-js';
import {CobaltBlue} from '@tests/colors-ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoldMetallic/>
    <CobaltBlue/>
  </React.StrictMode>,
)
