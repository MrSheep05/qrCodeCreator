import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CardCreator from './components/CardCreator';
import AppStateComponent from './utils/AppStateComponent';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.css';

const onDragEnd = () => {};

export default function App() {
  return (
    <AppStateComponent>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <DragDropContext onDragEnd={onDragEnd}>
                <CardCreator></CardCreator>
              </DragDropContext>
            }
          />
        </Routes>
      </Router>
    </AppStateComponent>
  );
}
