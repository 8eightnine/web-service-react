import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navigation from './components/Navigation';
import PhotoList from './components/PhotoList';
import PhotoDetail from './components/PhotoDetail';
import UploadPhoto from './components/UploadPhoto';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<PhotoList />} />
            <Route path="/photos" element={<PhotoList />} />
            <Route path="/photo/:slug" element={<PhotoDetail />} />
            <Route path="/upload" element={<UploadPhoto />} />
            <Route path="/photos/category/:category" element={<PhotoList />} />
            <Route path="/photos/tag/:tag" element={<PhotoList />} />
            <Route path="/user/:username" element={<PhotoList />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
