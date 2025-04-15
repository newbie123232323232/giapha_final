import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProfileForm from './components/Profile';
import FamilyTree from './components/FamilyTree';
import Events from './pages/Events';
import 'bootstrap/dist/css/bootstrap.min.css';
import GroupChat from './components/GroupChat'; 
import FamilyImages from './components/FamilyImages';
import FamilyFunds from './components/FamilyFunds/FamilyFunds';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/family-tree" element={<FamilyTree />} />
            <Route path="/events" element={<Events />} />
            <Route path="/group-chat" element={<GroupChat />} />
            <Route path="/family-images" element={<FamilyImages />} />
            <Route path="/family-funds" element={<FamilyFunds />} />
            <Route path="*" element={<div className="container">404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
