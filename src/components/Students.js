import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoStudents from "./NoStudents";
import StudentTable from "./StudentTable";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  // Effect to fetch the user
  useEffect(() => {
    const getUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting session: ", error.message);
        return;
      }

      if (user) {
        setUser(user.user);
      }
    };

    getUser();
  }, []);

  // Effect to fetch students, depending on user
  useEffect(() => {
    // Make sure user is not null
    if (!user) return;

    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select(
          `
              id,
              student_name,
              currency_amount,
              classroom_id,
              classroom: classroom_id ( name, currency_name )
          `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching students:", error.message);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return students.length > 0 ? (
    <StudentTable students={students} />
  ) : (
    <NoStudents />
  );
}

export default Students;
