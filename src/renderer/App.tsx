import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CardCreator from './components/CardCreator';
import AppStateComponent from './utils/AppStateComponent';
import './App.css';

export default function App() {
  return (
    <AppStateComponent>
      <Router>
        <Routes>
          <Route path="/" element={<CardCreator></CardCreator>} />
        </Routes>
      </Router>
    </AppStateComponent>
  );
}
