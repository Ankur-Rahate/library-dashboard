import axios from 'axios';
import useTokenStore from '../store';

const api = axios.create({
   baseURL : import.meta.env.VITE_BACKEND_URL,
   headers:{
    'Content-Type': 'application/json'
   }
})

api.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

 export const login = async (data) =>{
  return api.post('/api/users/login', data)
}


 export const signup = async (data) =>{
  return api.post('/api/users/register', data)
}

export const getBooks = async () => {
 return api.get('/api/books');
  
};

export const createBook = async (formData) => {
  const res = await api.post("/api/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
  
};


export const getBookById = async (id) => {
  const res = await api.get(`/api/books/${id}`);
  return res.data;
};

export const updateBook = async ({ id, formData }) => {
  const res = await api.patch(`/api/books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};



export const deleteBook = async (id) => {
  const res = await api.delete(`/api/books/${id}`);
  return res.data;
};

