import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    // interact with the backend using fetch
    await fetch("http://localhost:3000/api/employes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        if (response.status === 200) {
          return response.json();
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then((value) => {
        if (value) {
          localStorage.setItem("token", JSON.stringify(value.token));
          localStorage.setItem("employee", JSON.stringify(value.employee));
          navigate("/home");
        }
      });
  };

  return (
    <form className="login" onSubmit={submitHandler}>
      <div className="login__insideBox">
        <div className="login__insideBox__labels">
          <label htmlFor="identifiant">Identifiant : </label>
          <label htmlFor="password">Mot de passe : </label>
        </div>
        <div className="login__insideBox__inputs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre adresse mail"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />
        </div>
      </div>
      <div>
        <button type="submit" title="bouton valider" className="login__button">
          Valider
        </button>
      </div>
    </form>
  );
};

export default LoginBox;
