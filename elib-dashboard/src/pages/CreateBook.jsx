import { useState, useRef, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Upload, Image as ImageIcon } from "lucide-react";

const NewBookCard = ({ initialData, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [genre, setGenre] = useState(initialData?.genre || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverPreview, setCoverPreview] = useState(initialData?.coverImage || null);

  const coverRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setGenre(initialData.genre || "");
      setDescription(initialData.description || "");
      setCoverPreview(initialData.coverImage || null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const coverImage = coverRef.current?.files?.[0] || null;
    const file = fileRef.current?.files?.[0] || null;

    if (!title || !genre || !description) {
      return alert("Please fill all required fields.");
    }
    if (!initialData && (!coverImage || !file)) {
      return alert("Please upload both cover image and file.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("description", description);
    if (coverImage) formData.append("coverImage", coverImage);
    if (file) formData.append("file", file);

    onSubmit(formData);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleReset = () => {
    setTitle("");
    setGenre("");
    setDescription("");
    setCoverPreview(null);
    if (coverRef.current) coverRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {initialData ? "Edit book" : "Create new book"}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
          {initialData
            ? "Update the details of your book."
            : "Add details, upload a cover, and attach your book file."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</Label>
            <Input
              id="title"
              placeholder="e.g. The Pragmatic Programmer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Genre */}
          <div className="grid gap-2">
            <Label htmlFor="genre" className="text-gray-700 dark:text-gray-300">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger
                id="genre"
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
              >
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-fiction</SelectItem>
                <SelectItem value="self-help">Self-help</SelectItem>
                <SelectItem value="biography">Biography</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Cover image */}
          <div className="grid gap-2">
            <Label htmlFor="cover" className="text-gray-700 dark:text-gray-300">Cover image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="cover"
                type="file"
                accept="image/*"
                ref={coverRef}
                onChange={handleCoverChange}
                className="max-w-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                required={!initialData}
              />
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-24 w-16 object-cover rounded-md border shadow"
                />
              ) : (
                <div className="h-24 w-16 rounded-md border flex items-center justify-center text-gray-400 dark:text-gray-500 dark:border-gray-600">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG recommended, max ~2MB.</p>
          </div>

          {/* Book file */}
          <div className="grid gap-2">
            <Label htmlFor="file" className="text-gray-700 dark:text-gray-300">Book file</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              ref={fileRef}
              className="max-w-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
              required={!initialData}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Accepted: PDF</p>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief summary of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <CardFooter className="flex justify-end gap-3 px-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-4 py-2 rounded-md border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {initialData ? "Update book" : "Create book"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewBookCard;
