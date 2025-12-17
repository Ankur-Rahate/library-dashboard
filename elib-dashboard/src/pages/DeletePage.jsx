import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "../http/api";
import { Button } from "../components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

const DeleteBookButton = ({ id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteBook(id),
    onSuccess: () => {
      alert("Book deleted successfully!");
      queryClient.invalidateQueries(["books"]);
    },
    onError: (error) => {
      alert("Error deleting book");
      console.error(error);
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      mutation.mutate();
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={mutation.isPending}
      variant="destructive"
      size="sm"
      className="flex items-center gap-2"
    >
      {mutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete
        </>
      )}
    </Button>
  );
};

export default DeleteBookButton;

