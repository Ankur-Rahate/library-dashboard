import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../http/api";

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p>Error loading data</p>;

  const books = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  const totalBooks = books.length;
  const genres = new Set(books.map((b) => b.genre));
  const totalGenres = genres.size;
  const drafts = books.filter((b) => b.status === "draft").length;
  const recentBooks = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Top bar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-4">
         
        </div>
      </header>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Books</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-600">{totalBooks}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Genres</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-600">{totalGenres}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drafts</h2>
          <p className="mt-2 text-4xl font-bold text-indigo-600">{drafts}</p>
        </div>
      </div>

      {/* Recent books */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Books</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentBooks.map((book) => (
            <li key={book._id} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">{book.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(book.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
          {recentBooks.length === 0 && (
            <li className="py-3 text-gray-500 dark:text-gray-400">No books yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default HomePage;