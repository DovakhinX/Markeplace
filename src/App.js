import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Purchases from './pages/Purchases';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='Listing' element={<Listing/>}/>
        <Route path='Purchases' element={<Purchases/>}/>



</Routes>
    </div>
    
  )
}

export default App;