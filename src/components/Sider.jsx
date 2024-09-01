import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function Sider() {
    return (
        <div className="content120" id="sider20">
            <div className="sider-slogan20">
                <p>
                    From Concept to Completion
                </p>
            </div>
            <div className="sider-contents20">
                <p>
                    <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                    Code empowers evolution
                </p>
                <p>
                    <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                    Where Imagination meets Achievement
                </p>
                <p>
                    <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                    From Cool Concepts to Epic Realities
                </p>
                <p>
                    <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                    Innovate through scripting
                </p>
            </div>
        </div>
    )
}