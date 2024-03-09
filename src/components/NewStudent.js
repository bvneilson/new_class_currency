import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function NewStudent() {
  const [classrooms, setClassrooms] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if (user) {
        setUser(user.user);
      }

      if (error) {
        console.error("Error getting session: ", error.message);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch classrooms for dropdown selection
    const fetchClassrooms = async () => {
      const { data, error } = await supabase
        .from("classrooms")
        .select("id, name")
        .eq("teacher_id", user.id);

      if (error) {
        console.error("Error fetching classrooms: ", error.message);
      } else {
        setClassrooms(data);
        if (data.length > 0) {
          setSelectedClassroomId(data[0].id);
        }
      }
    };

    fetchClassrooms();

    const getUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if (user) {
        setUser(user.user);
      }

      if (error) {
        console.error("Error getting session: ", error.message);
      }
    };

    getUser();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("students").insert([
      {
        user_id: user.id,
        student_name: name,
        classroom_id: selectedClassroomId,
      },
    ]);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Student added successfully!");
      navigate("/students");
    }
  };

  const handleCancel = () => {
    navigate("/students");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Student
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Student Name Input */}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Student Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Classroom Selection Dropdown */}
            <div className="sm:col-span-4">
              <label
                htmlFor="classroom_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Classroom
              </label>
              <select
                id="classroom_id"
                name="classroom_id"
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                required
              >
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission and Cancellation Buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default NewStudent;
