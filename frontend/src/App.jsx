import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SingupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SingupPage/>}/>
    </Routes>
  )
}

export default App