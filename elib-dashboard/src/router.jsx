import { createBrowserRouter, Navigate} from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Dashboard from "./layouts/Dashboard";
import BookPage from "./pages/BookPage";
import Authlayout from "./layouts/Authlayout";
import CreateBook from "./pages/CreateBook";
import EditPage from "./pages/EditPage";
import DeleteBook from "./pages/DeletePage";
import DeleteBookButton from "./pages/DeletePage";
import BookDetailsPage from "./pages/BookDetailsPage";


const router =  createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"dashboard/home"}/>
  },

  {
    path: '/dashboard',
    element: <Dashboard/>,
    children:[
      {
        path:'home',
        element: <HomePage/>
      },
      {
        path:'book',
        element: <BookPage/>

      },
      
      {
        path:'book/create',
        element: <CreateBook/>

      },
      {
        path:`book/edit/:id`,
        element: <EditPage/>

      },
      {
        path:`book/delete/:id`,
        element: <DeleteBookButton/>

      },
      {
        path:`book/:id`,
        element: <BookDetailsPage/>

      }
    ]
  },

  {
    path: '/auth',
    element: <Authlayout />,
    children: [
      {
    path: 'login',
    element: <LoginPage />,
  },

   {
    path: 'signup',
    element: <Signup />,
  },

    ]

  },
  
  

])

export default router;