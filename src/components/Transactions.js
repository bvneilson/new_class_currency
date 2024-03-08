import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoTransactions from "./NoTransactions";
import TransactionTable from "./TransactionTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
    id,
    amount,
    reason,
    created_at,
    student: student_id ( 
      id, 
      student_name, 
      classroom: classroom_id ( id, name ) 
    )
  `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return transactions.length > 0 ? (
    <TransactionTable transactions={transactions} />
  ) : (
    <NoTransactions />
  );
}

export default Transactions;
