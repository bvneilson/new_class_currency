import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function StudentDetail() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [originalStudent, setOriginalStudent] = useState(null);
  const { studentId } = useParams();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);

      // Fetch student details
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select(
          `
          id,
          student_name,
          currency_amount,
          classroom: classroom_id ( id, name )
        `
        )
        .eq("id", studentId)
        .single();

      // Fetch transactions related to the student
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          reason,
          created_at
        `
        )
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (studentError) {
        console.error("Error fetching student details:", studentError.message);
      } else if (transactionError) {
        console.error("Error fetching transactions:", transactionError.message);
      } else {
        setStudent({ ...studentData, transactions: transactionData });
      }

      setLoading(false);
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveChanges = async (newDetails) => {
    const { error } = await supabase
      .from("students")
      .update({
        student_name: newDetails.student_name,
        currency_amount: newDetails.currency_amount,
      })
      .eq("id", studentId);

    if (error) {
      console.error("Error updating student details:", error.message);
    } else {
      setStudent({ ...student, ...newDetails });
      setOriginalStudent({ ...student, ...newDetails });
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setStudent(originalStudent);
    setEditing(false);
  };

  if (loading) return <div>Loading...</div>;

  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Student Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Details about the student.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {/* Display Student Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {editing ? (
                <input
                  type="text"
                  value={student.student_name}
                  onChange={(e) =>
                    setStudent({ ...student, student_name: e.target.value })
                  }
                />
              ) : (
                student.student_name
              )}
            </dd>
          </div>
          {/* Display Classroom Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Classroom
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {student.classroom.name}
            </dd>
          </div>
          {/* Display and Edit Currency Amount */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Currency Amount
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {editing ? (
                <input
                  type="number"
                  value={student.currency_amount}
                  onChange={(e) =>
                    setStudent({ ...student, currency_amount: e.target.value })
                  }
                />
              ) : (
                student.currency_amount
              )}
            </dd>
          </div>
          {/* Edit/Save Button */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={
                editing ? () => handleSaveChanges(student) : handleEditToggle
              }
              className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {editing ? "Save Changes" : "Edit"}
            </button>
          </div>
        </dl>
      </div>
      {/* Transactions Section */}
      <div className="flow-root mt-6">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Student Transactions
        </h3>
        <ul className="divide-y divide-gray-200">
          {student.transactions && student.transactions.length > 0 ? (
            student.transactions.map((transaction) => (
              <li key={transaction.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        Amount: {transaction.amount}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {transaction.reason || "No reason provided"}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No transactions found</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default StudentDetail;
