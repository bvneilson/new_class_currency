import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoStudents from "./NoStudents";
import StudentTable from "./StudentTable";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("students").select(`
            id,
            student_name,
            currency_amount,
            classroom_id,
            classroom: classroom_id ( name, currency_name )
        `);

      if (error) {
        console.error("Error fetching students:", error.message);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return students.length > 0 ? (
    <StudentTable students={students} />
  ) : (
    <NoStudents />
  );
}

export default Students;
