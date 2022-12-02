import LoginBox from "../components/loginBox";
import Header from "../components/Header";

const LoginPage = () => {
  localStorage.clear();
  return (
    <>
      <Header />
      <div className="loginPage">
        <h2>Merci de vous identifier</h2>
        <div>
          <LoginBox />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
