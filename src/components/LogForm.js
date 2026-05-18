import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './LogForm.css'; // Assuming you'll create this CSS file

function LogForm({ onSave }) {
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [insulinDose, setInsulinDose] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bg = parseFloat(bloodGlucose);
    const insulin = parseFloat(insulinDose);

    // Validation
    if (isNaN(bg) || bg <= 0) {
      setMessage('Blood glucose must be a positive number.');
      return;
    }
    if (isNaN(insulin) || insulin < 0) {
      setMessage('Insulin dose must be zero or greater.');
      return;
    }

    try {
      const { error } = await supabase
        .from('diabetes_logs')
        .insert([
          { blood_glucose_mmol: bg, insulin_units: insulin },
        ]);

      if (error) {
        throw error;
      }

      setMessage('Entry saved successfully!');
      setBloodGlucose('');
      setInsulinDose('');
      onSave(); // Notify parent to refresh history
    } catch (error) {
      setMessage(`Error saving entry: ${error.message}`);
      console.error('Error saving entry:', error);
    }
  };


  return (
    <div className="log-form-container">
      <h2>New Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bloodGlucose">Blood Glucose (mmol/L):</label>
          <input
            id="bloodGlucose"
            type="number"
            step="0.1"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(e.target.value)}
            placeholder="e.g., 5.5"
            required
            aria-label="Blood Glucose Level"
          />
        </div>
        <div className="form-group">
          <label htmlFor="insulinDose">Insulin Dose (units):</label>
          <input
            id="insulinDose"
            type="number"
            step="0.1"
            value={insulinDose}
            onChange={(e) => setInsulinDose(e.target.value)}
            placeholder="e.g., 10"
            required
            aria-label="Insulin Dose"
          />
        </div>
        <button type="submit" className="save-button">Save Entry</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default LogForm;