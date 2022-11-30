import React from "react";

const LoginBox = () => {
  return (
    <form className="login">
      <div className="login__insideBox">
        <div className="login__insideBox__labels">
          <label htmlFor="identifiant">Identifiant : </label>
          <label htmlFor="password">Mot de passe : </label>
        </div>
        <div className="login__insideBox__inputs">
          <input type="identifiant" placeholder="Entrez votre adresse mail" />
          <input type="password" placeholder="Entrez votre mot de passe" />
        </div>
      </div>
      <div>
        <button type="button" title="bouton valider" className="login__button">
          Valider
        </button>
      </div>
    </form>
  );
};

export default LoginBox;
