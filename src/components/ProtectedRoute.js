import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check for an existing session and set authenticated state accordingly
    checkSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentState = session ? true : false;
        setAuthenticated(currentState);
        setAuthenticating(false);
      }
    );

    // Cleanup function to unsubscribe from the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    const session = await supabase.auth.getSession();
    setAuthenticated(session ? true : false);
    setAuthenticating(false);
  }

  if (authenticating) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
