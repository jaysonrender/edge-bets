import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {useUserContext} from './hooks/useUserContext';

import Home from './pages/Home';
import Games from './pages/Games';
import Standings from './pages/Standings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserPicks from './pages/UserPicks';

import PickForm from './components/PickForm';
import Navbar from './components/Navbar';
import LeagueForm from './components/LeagueForm';


 
function App() {

  const {userToken} = useUserContext();
 

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path='/' element={!userToken ? <Login /> : <Navigate to='/home' />} />
            
            <Route path='/signup' element={!userToken ? <Signup /> : <Navigate to='/home' />} 
            />
            <Route path="/create-league" element={!userToken ? <LeagueForm /> : <Navigate to='/home' />}
            />
            <Route path='/home' element={userToken ? <Home /> : <Navigate to='/' />}
            />
            <Route path="/games" element={userToken ? <Games /> : <Navigate to='/' />} 
            />
            <Route path='/user/my-picks' element={userToken ? <UserPicks /> : <Navigate to='/' />}
            />
            <Route path="/submit-picks" element = {userToken ? <PickForm /> : <Navigate to='/'/>} 
            />
            <Route path='/standings' element = {userToken ? <Standings /> : <Navigate to='/' />}
            />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
