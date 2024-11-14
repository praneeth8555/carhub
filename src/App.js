import './App.css';
import Home from './screens/home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Signup from './screens/signup';
import Login from './screens/login';
import ProductCreation from './components/ProductCreation';
import CarDetails from './components/CarDetails'; // Component to view car details
import SearchResults from './components/SearchResults';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createcar" element={<ProductCreation />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Route for viewing car details */}
          <Route exact path="/car/:id" element={<CarDetails />} />

        
        </Routes>
      </Router>
    </>
  );
}

export default App;
