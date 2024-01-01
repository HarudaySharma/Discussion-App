import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Header from "./components/Header.jsx";
import QuestionPanel from "./pages/QuestionPanel.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/user/profile" element={<Profile />} />
        </Route>
        <Route path="/Sign_in" element={<SignIn />} />
        <Route path="/Sign_up" element={<SignUp />} />
        <Route path="/questions/panel" element={<QuestionPanel />} />

        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;