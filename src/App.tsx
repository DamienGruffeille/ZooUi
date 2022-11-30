import React from "react";
import LoginBox from "./components/loginBox";

const App: React.FC = () => {
  return (
    <div className="App">
      <span className="heading">Gestion du Zoo</span>
      <LoginBox />
    </div>
  );
};

export default App;
