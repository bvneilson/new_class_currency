import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import HomePage from "./HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Classrooms from "./components/Classrooms";
import NewClassroom from "./components/NewClassroom";
import NewStudent from "./components/NewStudent";
import "./App.css";
import Students from "./components/Students";
import StudentDetail from "./components/StudentDetail";
import Transactions from "./components/Transactions";
import NewTransaction from "./components/NewTransaction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <Layout>
                <Classrooms />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-classroom"
          element={
            <ProtectedRoute>
              <Layout>
                <NewClassroom />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-student"
          element={
            <ProtectedRoute>
              <Layout>
                <NewStudent />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <ProtectedRoute>
              <Layout>
                <StudentDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-transaction"
          element={
            <ProtectedRoute>
              <Layout>
                <NewTransaction />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Define other routes here */}
        {/* Redirect to signin by default if no routes match */}
        <Route render={() => <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
