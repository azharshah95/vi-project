import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Home from './Home'
import Dashboard from './Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
