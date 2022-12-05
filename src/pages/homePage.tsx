import Header from "../components/Header";

const HomePage = () => {
    return (
        <>
            <Header />

            <div className="id">
                <p>
                    Nom Prénom <br />
                    Rôle : <br />
                    Zone : <br />
                </p>
            </div>
            <main>
                <h1>Page principale</h1>
            </main>
        </>
    );
};
export default HomePage;
