import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import './LogHistory.css'; // Assuming you'll create this CSS file

function LogHistory({ refresh }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diabetes_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setLogs(data);
    } catch (error) {
      setError(`Error fetching logs: ${error.message}`);
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refresh]); // Refetch when refresh prop changes

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('diabetes_logs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      fetchLogs(); // Refresh the list after deletion
    } catch (error) {
      setError(`Error deleting entry: ${error.message}`);
      console.error('Error deleting entry:', error);
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="log-history-container">
      <h2>Entry History</h2>
      {logs.length === 0 ? (
        <p>No entries yet. Save a new entry above!</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log.id} className="log-item">
              <div className="log-details">
                <span className="log-date">{new Date(log.created_at).toLocaleString()}</span>
                <span className="log-glucose">Glucose: {log.blood_glucose_mmol} mmol/L</span>
                <span className="log-insulin">Insulin: {log.insulin_units} units</span>
              </div>
              <button onClick={() => handleDelete(log.id)} className="delete-button" aria-label="Delete entry">
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LogHistory;