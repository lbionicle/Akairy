import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {AdminApp, AdminInfo, AdminOffices, AdminUsers, AuthPage, MainPage, UserApp, UserInfo, UserLike} from "../pages"

const App = () => {

  const handleLogout = () => {
    localStorage.removeItem("userRole");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
        <Route path="/user-info" element={<UserInfo onLogout={handleLogout}/>}/>
        <Route path="/user-like" element={<UserLike onLogout={handleLogout}/>}/>
        <Route path="/user-app" element={<UserApp onLogout={handleLogout}/>}/>
        <Route path="/admin-info" element={<AdminInfo onLogout={handleLogout}/>}/>
        <Route path="/admin-offices" element={<AdminOffices onLogout={handleLogout}/>}/>
        <Route path="/admin-app" element={<AdminApp onLogout={handleLogout}/>}/>
        <Route path="/admin-users" element={<AdminUsers onLogout={handleLogout}/>}/>
      </Routes>
    </Router>
  );
};

export default App;
