import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

interface Pages {
    id: number;
    url: string;
    page: string;
    menuName: string;
}

type MenuProps = {
    currentPage: string;
};

const Menu = ({ currentPage }: MenuProps): ReactElement => {
    const pages: Pages[] = [
        { id: 1, url: "../home", page: "/home", menuName: "Home" },

        { id: 2, url: "../actions", page: "/actions", menuName: "Actions" },
        {
            id: 3,
            url: "../evenements",
            page: "/evenements",
            menuName: "Evènements"
        }
    ];
    return (
        <div className="header__bottom">
            <ul className="header__bottom__list">
                {pages.map((page) =>
                    page.page === currentPage ? (
                        <li key={page.id} className="activeLi">
                            <Link to={page.url}>&gt; {page.menuName}</Link>
                        </li>
                    ) : (
                        <li key={page.id}>
                            <Link to={page.url}>{page.menuName}</Link>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};

export default Menu;
