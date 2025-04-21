import React from "react";

const CustomButton = ({
    btnType, title, handleClick, styles
}) => {
    return (
        <button
           type={btnType}
           className={`{styles}`}
           onClick={handleClick}
        >
            {title}
        </button> 
    )
}

export default CustomButton