import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [name, setName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const employee = localStorage.getItem("employee");
    if (employee) {
      const employeeJSON = JSON.parse(employee);
      setName(employeeJSON.firstName);
    } else {
      setName("Inconnu");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("employee");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header>
      {name === "Inconnu" || name === undefined || name === "unknown" ? (
        <h1>GESTION DU ZOO</h1>
      ) : (
        <>
          <h1>GESTION DU ZOO</h1>
          <div className="logout">
            <div className="logout__name">Bienvenue {name}</div>
            <button onClick={handleLogout} className="logout__btn">
              Déconnexion
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
