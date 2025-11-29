
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const handleCartPage = () => {
        navigate("/cart"); 
    };
    const handleOrderPage = () => {
        navigate("/orders")
    }

    return <div>
        <button onClick={handleCartPage} className="block">cart</button>
        <button onClick={handleOrderPage}>order</button>
    </div>;
}
