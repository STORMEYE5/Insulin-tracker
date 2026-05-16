import React, { useState } from 'react';
import LogForm from './components/LogForm';
import LogHistory from './components/LogHistory';
import './App.css'; // Main application styles

function App() {
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleEntrySave = () => {
    setRefreshHistory(!refreshHistory); // Toggle to trigger history refresh
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Diabetes Log PWA</h1>
      </header>
      <main className="app-main">
        <LogForm onSave={handleEntrySave} />
        <LogHistory refresh={refreshHistory} />
      </main>
    </div>
  );
}

export default App;