import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../http/api";
import { RefreshCw } from "lucide-react";
import useTokenStore from "../store";

const Signup = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
  });

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      return alert("Please enter name, email, and password");
    }

    mutation.mutate({ name, email, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-sm shadow-xl rounded-xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your details below to sign up.
            {mutation.isError && (
              <span className="block mt-2 text-red-600 dark:text-red-400 text-sm">
                {mutation.error.message}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </FieldLabel>
                <Input
                  ref={nameRef}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </FieldLabel>
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Password
                </FieldLabel>
                <Input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  required
                  className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                />
                <FieldDescription className="text-gray-500 dark:text-gray-400 mt-1">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <span>Create Account</span>
                </Button>

                <FieldDescription className="text-center text-gray-600 dark:text-gray-400 mt-2">
                  Already have an account?
                  <Link
                    to="/auth/login"
                    className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Log in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
