import './App.css'
import Home from './pages/home/Home'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {EnergeticProvider} from "./contexts/EnergeticContext.tsx";

function App() {

    return (
        <EnergeticProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </BrowserRouter>
        </EnergeticProvider>
    )
}

export default App
