import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './view/LoginView';
import SuccessView from './view/SuccessView';
import { AuthProvider, useAuth } from './components/AuthContext';

function AppContent() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={<LoginView />} />
      <Route path="/success" element={token ? <SuccessView /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
