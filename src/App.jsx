// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth, Screen } from '@/layouts';
import Session from './session';

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={
        <Session>
          <Dashboard />
        </Session>
      } />
      <Route path="/screen/*" element={
        <Session>
          <Screen />
        </Session>
      } />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;