import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Layout, Garage, Winners} from './components'
import './App.css'

function App() {
  return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Layout/> }>
                    <Route index element={ <Garage/> } />
                    <Route path="winners" element={ <Winners/> }/>
                </Route>
            </Routes>
        </BrowserRouter>

  )
}

export default App
