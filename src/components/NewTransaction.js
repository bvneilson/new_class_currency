import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function NewTransaction() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch students for dropdown selection
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, student_name");

      if (error) {
        console.error("Error fetching students: ", error.message);
      } else {
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudentId(data[0].id);
        }
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error: insertError } = await supabase.from("transactions").insert([
      {
        student_id: selectedStudentId,
        amount: amount,
        reason: reason,
      },
    ]);

    if (insertError) {
      alert(`Error adding transaction: ${insertError.message}`);
      return;
    }

    let { data: studentData, error: studentFetchError } = await supabase
      .from("students")
      .select("currency_amount")
      .eq("id", selectedStudentId)
      .single();

    if (studentFetchError) {
      alert(`Error fetching student data: ${studentFetchError.message}`);
      return;
    }

    // Calculate the new currency_amount
    const newCurrencyAmount =
      (studentData.currency_amount || 0) + parseFloat(amount);

    const { error: studentUpdateError } = await supabase
      .from("students")
      .update({ currency_amount: newCurrencyAmount })
      .eq("id", selectedStudentId);

    if (studentUpdateError) {
      alert(
        `Error updating student's currency amount: ${studentUpdateError.message}`
      );
      return;
    }

    alert("Transaction completed successfully!");
    navigate("/transactions");
  };

  const handleCancel = () => {
    navigate("/transactions");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Transaction
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Student Selection Dropdown */}
            <div className="sm:col-span-4">
              <label
                htmlFor="student_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Student
              </label>
              <select
                id="student_id"
                name="student_id"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="sm:col-span-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Reason Input */}
            <div className="sm:col-span-6">
              <label
                htmlFor="reason"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Reason (optional)
              </label>
              <div className="mt-2">
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                ></textarea>
              </div>
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

export default NewTransaction;
