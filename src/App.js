import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home.js';
import Listing from './pages/Listing.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='Listing' element={<Listing/>}/>


</Routes>
    </div>
    
  )
}

export default App;