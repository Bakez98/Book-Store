import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleAddToCart = async (book) => {
    try {
      let token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart",
        { book },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Book added to cart");
    } catch (error) {
      console.error("Failed to add book to cart:", error);
      alert("Failed to add book to cart");
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
        <button className={styles.goToCartButton} onClick={handleGoToCart}>
          Go to Cart
        </button>
      </div>
      <h1 className={styles.heading}>Books</h1>
      <div className={styles.cardsContainer}>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className={styles.card}>
              <h2 className={styles.cardTitle}>{book.title}</h2>
              <p className={styles.cardAuthor}>by {book.author}</p>
              <button
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(book)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className={styles.card}>No books available</div>
        )}
      </div>
    </div>
  );
};

export default Books;
