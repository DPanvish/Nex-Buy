import {SignedOut, SignInButton, SignedIn, UserButton, useAuth} from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import DashboardLayout from './layouts/DashboardLayout';
import PageLoader from './components/PageLoader';




const App = () => {

  const {isSignedIn, isLoaded} = useAuth();

  if(!isLoaded){
    return <PageLoader />;
  }

  return (
    <div>
      <Routes>
        <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />

        <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
        
      </Routes>
    </div>
  )
}

export default App