import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Menu from "./Menu";

const Header = () => {
    const [name, setName] = useState("");
    let navigate = useNavigate();
    const location = useLocation();

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
        <header className="header">
            {name === "Inconnu" || name === undefined || name === "unknown" ? (
                <h1>GESTION DU ZOO</h1>
            ) : (
                <>
                    <div className="header__top">
                        <img src="../../public/logo.jfif" alt="logo" />
                        <h1>GESTION DU ZOO</h1>
                        <div className="header__top__logout">
                            <div className="header__top__logout__name">
                                Bienvenue {name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="header__top__logout__btn"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                    <Menu currentPage={location.pathname} />
                </>
            )}
        </header>
    );
};

export default Header;
