import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const handleCartPage = () => {
        navigate("/cart"); 
    };

    return <button onClick={handleCartPage}>cart</button>;
}
