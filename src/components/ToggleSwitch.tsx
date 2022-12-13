import React, { ReactElement } from "react";
import "../styles/components/ToggleSwitch.scss";

type Props = {
    labelG: string;
    labelD: string;
};

const ToggleSwitch = ({ labelG, labelD }: Props): ReactElement => {
    return (
        <div className="container">
            {labelG}{" "}
            <div className="toggle-switch">
                <input
                    title="switch"
                    type="checkbox"
                    className="checkbox"
                    name={"inOut"}
                    id={"inOut"}
                />
                <label className="label" htmlFor={"inOut"}>
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>{" "}
            {labelD}
        </div>
    );
};

export default ToggleSwitch;
