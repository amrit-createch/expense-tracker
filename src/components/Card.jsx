import React, { useEffect, useState } from 'react'
import { getAllTransactions, saveTransaction } from "../Db";

function Card() {
  const [remainingBalance, setRemainingbalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [Expenses, setExpenses] = useState(0);
  const [newExpense, setNewExpense] = useState("");
  const [newIncome, setNewIncome] = useState("");
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [category, setcategory] = useState("");
  const [description, setDiscription] = useState("");

  useEffect(() => {
    getAllTransactions().then((allTransactions) => {
      setTransactions(allTransactions);
      const totalIncome = allTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const totalExpenses = allTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setRemainingbalance(totalIncome - totalExpenses);
    });
  }, []);

  const addIncome = (e) => {
    e.preventDefault();
    if (!newIncome) return;
    const amount = Number(newIncome);
    if (amount <= 0) {
    setNewIncome(""); 
    return;
  }
    const transaction = {
      type: "income",
      category: "Income",
      description: "",
      amount,
    };
    setIncome(income + amount);
    setRemainingbalance(remainingBalance + amount);
    setTransactions([...transactions, transaction]);
    saveTransaction(transaction);
    setNewIncome("");
  };


  const addExpenses = (e) => {
    e.preventDefault();
    if (!newExpense) return;
    const amount = Number(newExpense);
    if (remainingBalance >= amount) {
      const transaction = {
        type: "expense",
        category,
        description,
        amount,
      };
      setExpenses(Expenses + amount);
      setRemainingbalance(remainingBalance - amount);
      setTransactions([...transactions, transaction]);
      saveTransaction(transaction);
      setError("");
    } else {
      setError("Insufficient balance");
    }
    setNewExpense("");
    setDiscription("");
    setcategory("");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        width: "90%",
        maxWidth: "800px",
        backgroundColor: "aliceblue",
        margin: "auto",
        textAlign: "center",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 0 10px black",
      }}
    >
      <h2>EXPENSE TRACKER</h2>

     
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "100px",
            marginTop: "20px",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "aqua",
            boxShadow: "0 0 10px black",
            borderRadius: "10px",
          }}
        >
          <h3>Available Balance: ${remainingBalance}</h3>
        </div>
      </div>

     
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap", 
          marginTop: "20px",
          gap: "10px",
        }}
      >
       
        <div
          style={{
            flex: "1 1 300px",
            minWidth: "250px",
            height: "auto",
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            boxShadow: "0 0 10px black",
            borderRadius: "10px",
          }}
        >
          <h4>INCOME</h4>
          <h3>${income}</h3>
          <input
            type="number"
            value={newIncome}
            onChange={(e) => setNewIncome(e.target.value)}
            placeholder="Enter Income"
            style={{ width: "80%", padding: "5px", marginTop: "5px" }}
          />
          <button
            onClick={addIncome}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "darkgreen",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add Income
          </button>
        </div>

        
        <div
          style={{
            flex: "1 1 300px",
            minWidth: "250px",
            height: "auto",
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            boxShadow: "0 0 10px black",
            borderRadius: "10px",
          }}
        >
          <h4>EXPENSE</h4>
          <h3>${Expenses}</h3>
          {error && (
            <p
              style={{
                fontWeight: "bold",
                color: "yellow",
                marginTop: "5px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      
      <h3 style={{ marginTop: "30px" }}>ADD NEW TRANSACTION</h3>
      <form
        style={{
          padding: "20px",
          margin: "auto",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <select
          name="category"
          value={category}
          onChange={(e) => setcategory(e.target.value)}
          required
          style={{ margin: "5px", padding: "5px" }}
        >
          <option value="">Select Category</option>
          <option value="Food & Groceries">Food & Groceries </option>
          <option value="Rent / Housing">Rent / Housing</option>
          <option value="Utilities">Utilities</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Loan">Loan / EMI Payments</option>
          <option value="Transportation">Transportation</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDiscription(e.target.value)}
          style={{ margin: "5px", padding: "5px" }}
        />
        <input
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          type="number"
          placeholder="Enter Amount"
          required
          style={{ margin: "5px", padding: "5px" }}
        />
        <button
          onClick={addExpenses}
          type="submit"
          style={{
            margin: "5px",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "darkred",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Transaction
        </button>
      </form>

      {/* History */}
      <h3 style={{ marginTop: "20px" }}>Transaction History</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((t, index) => (
          <li
            key={index}
            style={{
              background: "#fff",
              margin: "5px auto",
              padding: "10px",
              width: "95%",
              maxWidth: "500px",
              borderRadius: "5px",
              boxShadow: "0 0 5px gray",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <span>
              {t.category} - {t.description}
            </span>
            <span style={{ color: t.type === "income" ? "green" : "red" }}>
              {t.type === "income" ? `+$${t.amount}` : `-$${t.amount}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Card;
