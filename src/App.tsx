import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LogginPage from "./pages/loginPage";
// import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<LogginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
