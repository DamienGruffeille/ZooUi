import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LogginPage from "./pages/loginPage";
import ZonePage from "./pages/zonesPage";
import EnclosPage from "./pages/enclosPage";
import EspecePage from "./pages/especesPage";
import AnimauxPage from "./pages/animauxPage";
import ActionsPage from "./pages/actionsPage";
import EvenementsPage from "./pages/evenementsPage";
import Footer from "./components/Footer";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LogginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/zones" element={<ZonePage />} />
                    <Route path="/enclos" element={<EnclosPage />} />
                    <Route path="/especes" element={<EspecePage />} />
                    <Route path="/animaux" element={<AnimauxPage />} />
                    <Route path="/actions" element={<ActionsPage />} />
                    <Route path="/evenements" element={<EvenementsPage />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
};

export default App;
