import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoClassrooms from "./NoClassrooms";
import ClassroomTable from "./ClassroomTable";

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("classrooms").select("*");

      if (error) {
        console.error("Error fetching classrooms:", error.message);
      } else {
        setClassrooms(data);
      }
      setLoading(false);
    };

    fetchClassrooms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return classrooms.length > 0 ? (
    <ClassroomTable classrooms={classrooms} />
  ) : (
    <NoClassrooms />
  );
}

export default Classrooms;
