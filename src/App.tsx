import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ShopProvider } from './contexts/ShopContext';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';
import CategoryPage from './pages/category/[slug]';
import MainCategoryPage from './pages/categorypage';
import ProductPage from './pages/product/[id]';
import CartPage from './pages/cart';
import BlogPage from './pages/blog';
import BlogPostPage from './pages/blog/[id]';
import ContactPage from './pages/contact-us';
import TermsAndConditionsPage from './pages/terms-and-condition';
import ShippingAndReturnsPage from './pages/shipping-and-returns';
import { NotFound } from './components/NotFound';
import { CheckoutProvider } from './contexts/CheckoutContext';
import CheckoutPage from './pages/checkout';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyACEOM0JvL7Z9MTX59oa-d8AKx0Q6aPL2c',
  authDomain: 'industry-waala.firebaseapp.com',
  projectId: 'industry-waala',
  storageBucket: 'industry-waala.firebasestorage.app',
  messagingSenderId: '393703824453',
  appId: '1:393703824453:web:15ed444e96c6d7e971d72c',
  measurementId: 'G-HD7K1RPETG',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function App() {
  return (
    <CheckoutProvider>
      <ShopProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/categories/:slug' element={<CategoryPage />} />
            <Route path='/categories' element={<MainCategoryPage />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/blog' element={<BlogPage />} />
            <Route path='/blog/:id' element={<BlogPostPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route
              path='/terms-and-conditions'
              element={<TermsAndConditionsPage />}
            />
            <Route
              path='/shipping-and-returns'
              element={<ShippingAndReturnsPage />}
            />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
      </ShopProvider>
    </CheckoutProvider>
  );
}

export default App;
