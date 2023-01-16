import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import "./style.scss";
import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


function App() {

  const {currentUser} = useContext(AuthContext)
  // console.log(currentUser);

  // Protected Route (When user is null we will automatically navigate to login page)
  // even if we try to go to Home Page, we will navigate to Login Page.
  const ProtectedRoute = ({children}) => {
      if(!currentUser){
          return <Navigate to="/login" />
      }

      // else go to home page
      return children;
  }
  
  // we have passed Home component in ProtectedRoute Below

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path='login' element={<Login/>} />
          <Route path='register' element={<Register/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
