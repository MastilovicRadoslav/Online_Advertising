import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SingupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SingupPage/>}/>
      <Route path='/' element={<HomePage/>}/>
    </Routes>
  )
}

export default App