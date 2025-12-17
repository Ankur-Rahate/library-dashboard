import { useParams, useNavigate } from "react-router-dom";
import { getBookById, updateBook } from "../http/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NewBookCard from "./CreateBook";
import { Card } from "@/components/ui/card";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // fetch the book details
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
  });

  // mutation for updating
  const mutation = useMutation({
    mutationFn: (formData) => updateBook({ id, formData }),
    onSuccess: () => {
      alert("Book updated successfully!");
      queryClient.invalidateQueries(["books"]);
      navigate("/dashboard/book");
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading book...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-600 dark:text-red-400">
          Failed to load book.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Edit Book
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update the details of your book below.
          </p>
        </div>

        <div className="p-6">
          <NewBookCard
            initialData={book}
            onSubmit={(formData) => mutation.mutate(formData)}
            loading={mutation.isPending}
          />
        </div>
      </Card>
    </div>
  );
};

export default EditPage;
