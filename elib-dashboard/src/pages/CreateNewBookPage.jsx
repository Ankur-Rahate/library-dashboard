import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBook } from "../http/api";
import NewBookCard from "./CreateBook";




function CreateNewBookPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      alert("Book created successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      navigate("/dashboard/book");
    },
    onError: () => {
      alert("Create book failed");
    },
  });

  return (
    <NewBookCard
      onSubmit={(formData) => mutation.mutate(formData)}
      loading={mutation.isPending}
    />
  );
}

export default CreateNewBookPage;
