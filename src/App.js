import './App.css';
import AuthContext, {AuthProvider} from "./context/AuthContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NavBar from "./components/NavBar";
import Roles from "./pages/Roles";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/' exact element={<><NavBar /> <Main /></>} />
              <Route path={'/roles'} element={<><NavBar /><Roles /></>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
  );
}

export default App;
