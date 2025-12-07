import { Book } from "../../types";
import FavoriteProductsCarousel from "./FavoriteProductsCarousel";
import BestsellerSection from "./BestsellerSection";
import CategoryBook from "../Books/CategoryBook";

interface SuggestProductProps {
    books: Book[];
}

export default function SuggestProduct({ books }: SuggestProductProps) {
    return (
        <>
            <FavoriteProductsCarousel books={books} />
            <CategoryBook />
            <BestsellerSection books={books} />
        </>
    );
}
