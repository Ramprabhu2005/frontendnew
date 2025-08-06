import HeaderComponent from "./component/HeaderComponent";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateAccount from "./component/CreateAccount";
import LoginComponent from "./component/LoginComponent";
import { getLoggedInUserId, isUserLoggedIn, getLoggedInUser } from "./service/AuthApiService";
import TasksComponent from "./component/TasksComponent";
import AddTaskComponent from "./component/AddTaskComponent";
import TaskHistory from "./component/TaskHistory";
import HomePage from "./component/Home";
import DetailPage from "./component/DetailPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

function App() {
  const [activeUserId, setActiveUserId] = useState(getLoggedInUserId());
  const [isAuthenticated, setIsAuthenticated] = useState(isUserLoggedIn());

  // Update auth state when it changes
  useEffect(() => {
    const checkAuth = () => {
      const userId = getLoggedInUserId();
      const loggedIn = isUserLoggedIn();
      console.log('Auth state updated - isAuthenticated:', loggedIn, 'userId:', userId);
      setActiveUserId(userId);
      setIsAuthenticated(loggedIn);
    };

    // Listen for storage changes (useful when logging in/out from other tabs)
    const handleStorageChange = () => {
      console.log('Storage change detected, checking auth state...');
      checkAuth();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // Also check auth state on mount
    console.log('App mounted, checking initial auth state...');
    checkAuth();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function AuthenticatedRoute({ children }) {
    const loggedIn = isUserLoggedIn();
    console.log('AuthenticatedRoute - isAuthenticated:', isAuthenticated, 'loggedIn:', loggedIn);
    
    if (isAuthenticated && loggedIn) {
      return children;
    }
    
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <HeaderComponent isAuthenticated={isAuthenticated} username={getLoggedInUser()} onLogout={() => {
          setActiveUserId(null);
          setIsAuthenticated(false);
        }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <AuthenticatedRoute>
                <TasksComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />

          <Route
           path="/task-details/:id" 
           element={
              <AuthenticatedRoute>
              <DetailPage userId={activeUserId}/> 
                </AuthenticatedRoute>
           }
              />

          <Route
            path="/history"
            element={
              <AuthenticatedRoute>
                <TaskHistory userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/update-task/:id"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginComponent onLoginSuccess={() => {
  setActiveUserId(getLoggedInUserId());
  setIsAuthenticated(isUserLoggedIn());
}} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
