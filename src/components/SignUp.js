import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const checkInitialSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (session && session.session !== null) {
        navigate("/");
      } else {
        setLoading(false);
      }

      if (error) {
        console.error("Error getting session: ", error.message);
      }
    };

    checkInitialSession();

    const { data: authListener, error } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.session !== null) {
          navigate("/");
        }

        if (error) {
          console.error("Error getting session: ", error.message);
        }
      }
    );

    // Cleanup function to unsubscribe from the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(
        "Signup successful, check your email to confirm your account!"
      );
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=teal&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </form>

          {message && <p>{message}</p>}

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a
              href="/login"
              className="font-semibold leading-6 text-teal-600 hover:text-teal-500"
            >
              Log in instead.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
