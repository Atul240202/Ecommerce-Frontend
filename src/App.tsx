import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';
import CategoryPage from './pages/category/[slug]';
import MainCategoryPage from './pages/categorypage';
import ProductPage from './pages/product/[id]';

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
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/categories' element={<MainCategoryPage />} />
        <Route path='/categories/:slug' element={<CategoryPage />} />
        <Route path='/product/:id' element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
