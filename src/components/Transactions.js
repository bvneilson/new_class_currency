import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import NoTransactions from "./NoTransactions";
import TransactionTable from "./TransactionTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  // Effect to fetch transactions, depending on user
  useEffect(() => {
    // Make sure user is not null
    if (!user) return;

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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return transactions.length > 0 ? (
    <TransactionTable transactions={transactions} />
  ) : (
    <NoTransactions />
  );
}

export default Transactions;
