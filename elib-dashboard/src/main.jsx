import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import{QueryClientProvider,QueryClient} from '@tanstack/react-query'

import { RouterProvider } from 'react-router-dom'
import  router from './router.jsx'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>

    <RouterProvider router={router}/>

    </QueryClientProvider>
 
)
