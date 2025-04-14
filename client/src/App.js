import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProfileForm from './components/Profile';
import FamilyTree from './components/FamilyTree';
import Events from './components/Events';
import 'bootstrap/dist/css/bootstrap.min.css';
import GroupChat from './components/GroupChat'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/family-tree" element={<FamilyTree />} />
        <Route path="/events" element={<Events />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="*" element={<div className="container">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
