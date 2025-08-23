import './App.css'
import Home from './pages/home/Home'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {

  return (
<BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
</BrowserRouter>
  )
}

export default App
