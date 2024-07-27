// App.js

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Books from "./Pages/BooksPage/Books";
import Login from "./Pages/LoginPage/Login";
import Cart from "./Pages/CartPage/Cart";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/books" element={<Books />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
