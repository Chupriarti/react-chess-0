import Chessboard from 'chessboardjsx';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Chessboard
        position="start"
        width={500}
        />
    </div>
  );
}

export default App;
