import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import bookApi from "../api/bookApi";
import { Book } from "../types";

interface BookContextType {
    books: Book[];
    loading: boolean;
    error: string | null;
    fetchBooks: (
        page?: number,
        size?: number,
        sort?: string,
        filter?: string
    ) => Promise<void>;
    totalPages: number;
    totalBooks: number;
    refetchBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [lastFetchParams, setLastFetchParams] = useState({
        page: 0,
        size: 100,
    });

    const fetchBooks = async (
        page: number = 0,
        size: number = 100,
        sort?: string,
        filter?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            setLastFetchParams({ page, size });

            const response = await bookApi.getAllBooks({
                page,
                size,
                sort,
                filter,
            });
            if (response.data?.result) {
                setBooks(response.data.result);
                setTotalPages(response.data.meta?.pages || 1);
                setTotalBooks(
                    response.data.meta?.total || response.data.result.length
                );
            }
        } catch (err: any) {
            console.error("Error fetching books:", err);
            setError(err.message || "Có lỗi xảy ra khi tải sách");
        } finally {
            setLoading(false);
        }
    };

    const refetchBooks = async () => {
        await fetchBooks(lastFetchParams.page, lastFetchParams.size);
    };

    // NOTE: Removed initial fetch to prevent duplicate loading
    // Each page will fetch its own data when needed

    return (
        <BookContext.Provider
            value={{
                books,
                loading,
                error,
                fetchBooks,
                totalPages,
                totalBooks,
                refetchBooks,
            }}
        >
            {children}
        </BookContext.Provider>
    );
};

export const useBooks = () => {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error("useBooks must be used within a BookProvider");
    }
    return context;
};
