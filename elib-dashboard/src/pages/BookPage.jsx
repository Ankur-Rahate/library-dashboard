import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBooks } from "@/http/api";

import { useQuery } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteBookButton from "./DeletePage";

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000,
  });

  const books = data?.data || [];

  const filteredBooks = books
    .filter((book) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.name?.toLowerCase().includes(query);

      const matchesGenre = genreFilter ? book.genre === genreFilter : true;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
    });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Add book button */}
      <div className="flex items-center justify-end mb-6">
        <Link to="/dashboard/book/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <CirclePlus size={20} />
            <span className="ml-2">Add book</span>
          </Button>
        </Link>
      </div>

      {/* Search & filter controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        />

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">All genres</option>
          <option value="technology">Technology</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-fiction</option>
          <option value="self-help">Self-help</option>
          <option value="biography">Biography</option>
          <option value="fantasy">Fantasy</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Books table */}
      <Card className="mt-6 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-100 dark:bg-gray-800">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Books
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage your books and view their performance.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table className="w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow
                  key={book._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt={book.title}
                      className="aspect-square rounded-md object-cover shadow"
                      height="64"
                      src={book.coverImage}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    <Link
                      to={`/dashboard/book/${book._id}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {book.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="px-2 py-1 rounded-full">
                      {book.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">
                    {book.author?.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-800 shadow-lg rounded-md"
                      >
                        <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link to={`/dashboard/book/edit/${book._id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DeleteBookButton id={book._id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {filteredBooks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-500 dark:text-gray-400 py-8"
                  >
                    No books match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        
      </Card>
    </div>
  );
};


export default BooksPage;
