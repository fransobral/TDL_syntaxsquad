import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import MovieApp from './components/MovieApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MovieApp></MovieApp>
  </React.StrictMode>,
)
