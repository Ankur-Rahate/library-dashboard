import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/http/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
  });

  if (isLoading)
    return <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-600 dark:text-red-400">
        Failed to load book.
      </p>
    );
  if (!book) return <p className="text-center">Book not found.</p>;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl mt-10 bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-col items-center border-b border-gray-200 dark:border-gray-700 pb-6">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-48 h-64 object-cover rounded-lg border shadow-md mb-4"
        />
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {book.title}
        </CardTitle>
        <CardDescription className="mt-2">
          <Badge
            variant="outline"
            className="px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500"
          >
            {book.genre}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {book.description}
        </p>
      </CardContent>

      <CardFooter className="flex gap-4 justify-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-6 py-2 rounded-lg"
        >
          <a href={book.file} target="_blank" rel="noopener noreferrer">
            Read Book
          </a>
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/book")}
          className="px-6 py-2 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Back to list
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookDetailsPage;
