// App.jsx –> sets up all routes for the INKED
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import GuestRoute from './Components/GuestRoute.jsx'
import AdminRoute from "./Components/AdminRoute";
import Bookmarks from "./Pages/Bookmarks";


import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Editor from './Pages/Editor.jsx'
import BlogDetail from './Pages/BlogDetail.jsx'
import Blogs from "./Pages/Blogs.jsx"
import AdminDashboard from "./Pages/AdminDashboard";
import AuthWatcher from "./Components/AuthWatcher";
import Profile from "./Pages/Profile";


export default function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/login" element={    
            <GuestRoute>
              <Login />
            </GuestRoute>
        }     
        />  {/*Meaning: If the URL becomes /login, show the Login component.*/}
        {/*URL -> localhost:5173/login, THEN <Login /> but gotta check if the user is alreadylogged in */}
        
        <Route path="/signup" element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
        }
/>
        <Route path="/blogs" element={<Blogs />} />
        <Route
  path="/bookmarks"
  element={<Bookmarks />}
/>
        <Route path="/dashboard" element={
            <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>
        }
       />
        <Route
  path="/editor"
  element={
    <ProtectedRoute>
      <Editor />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile/:username"
  element={<Profile />}
/>

<Route
  path="/editor/:id"
  element={
    <ProtectedRoute>
      <Editor />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
        {/* :slug is the unique ID for each blog post */}
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
