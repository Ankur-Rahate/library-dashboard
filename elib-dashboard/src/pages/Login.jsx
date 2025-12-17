import React, { useRef } from "react";
import { RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { FieldDescription } from "../components/ui/field";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../http/api";
import useTokenStore from "../store";

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
  });

  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      return alert("Please enter email and password");
    }

    mutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-sm shadow-xl rounded-xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your email and password below to access your dashboard.
            {mutation.isError && (
              <span className="block mt-2 text-red-600 dark:text-red-400 text-sm">
                {mutation.error.message}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                ref={emailRef}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                ref={passwordRef}
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleLoginSubmit}
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            <span>Login</span>
          </Button>

          <FieldDescription className="text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
            <Link
              to="/auth/signup"
              className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Signup
            </Link>
          </FieldDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
