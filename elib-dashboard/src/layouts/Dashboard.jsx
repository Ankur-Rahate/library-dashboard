import { Link, Navigate, Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import { AppSidebar } from "../components/app-sidebar";
import useTokenStore from "../store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

const Dashboard = () => {
  const { token, setToken } = useTokenStore((state) => state);
  if (token === "") {
    return <Navigate to={"/auth/login"} replace />;
  }

  const logout = () => {
    setToken("");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          {/* Left side: Sidebar + Breadcrumb */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-5"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard/home"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard/book"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Books
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side: Profile dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-indigo-500 transition-all">
                  <AvatarImage src="/profile.png" alt="Profile" />
                  <AvatarFallback className="bg-indigo-600 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2"
              >
                <DropdownMenuItem asChild>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Log Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
