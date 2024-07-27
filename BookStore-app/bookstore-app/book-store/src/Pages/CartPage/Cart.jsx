import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSubmitCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart/submit",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Cart submitted successfully");
      navigate("/books");
    } catch (err) {
      setError("Failed to submit cart");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
        <button className={styles.submitButton} onClick={handleSubmitCart}>
          Submit Cart
        </button>
      </div>
      <h1 className={styles.heading}>Your Cart</h1>
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>Your cart is empty</div>
      ) : (
        <div className={styles.cardItems}>
          {cart.map((book, index) => (
            <div key={index} className={styles.card}>
              <h2 className={styles.cardTitle}>{book.title}</h2>
              <p className={styles.cardAuthor}>by {book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
