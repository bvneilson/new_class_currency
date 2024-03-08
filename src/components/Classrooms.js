import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoClassrooms from "./NoClassrooms";
import ClassroomTable from "./ClassroomTable";

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
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

  // Effect to fetch classrooms, depending on user
  useEffect(() => {
    // Make sure user is not null
    if (!user) return;

    const fetchClassrooms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("classrooms")
        .select("*")
        .eq("teacher_id", user.id);

      if (error) {
        console.error("Error fetching classrooms:", error.message);
      } else {
        setClassrooms(data);
      }
      setLoading(false);
    };

    fetchClassrooms();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return classrooms.length > 0 ? (
    <ClassroomTable classrooms={classrooms} />
  ) : (
    <NoClassrooms />
  );
}

export default Classrooms;
