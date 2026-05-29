import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/products/', product);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (id, product) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${id}`, product);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return { products, addProduct, updateProduct, deleteProduct };
}
