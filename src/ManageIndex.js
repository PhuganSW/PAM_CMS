import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import './Profile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Layout from './Layout';
import {Select, FormControl, InputLabel } from '@mui/material';



function ManageIndex() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // Fetch categories from Firestore
    const unsubscribe = firestore.getAllCategories(
      (categoriesData) => setCategories(categoriesData),
      (error) => console.error("Error fetching categories: ", error)
    );
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  const handleCategoryChange = async (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    // Fetch items for the selected category
    const unsubscribe = firestore.getItemsOfCategory(
      category,
      (itemsData) => setItems(itemsData),
      (error) => console.error("Error fetching items: ", error)
    );
    return unsubscribe; // Cleanup listener on category change
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
    firestore.addCategory(
      newCategory,
      (categoryId) => {
        setCategories([...categories, { id: categoryId, name: newCategory }]);
        setNewCategory('');
      },
      (error) => console.error("Error adding category: ", error)
    );
  };

  const handleAddItem = async () => {
    if (newItem.trim() === '') return;
    firestore.addItemToCategory(
      selectedCategory,
      newItem,
      (itemId) => {
        setItems([...items, { id: itemId, name: newItem }]);
        setNewItem('');
      },
      (error) => console.error("Error adding item: ", error)
    );
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item.name);
  };

  const handleUpdateItem = async () => {
    firestore.updateItemInCategory(
      selectedCategory,
      editingItem.id,
      { name: newItem },
      () => {
        setItems(items.map(item => item.id === editingItem.id ? { ...item, name: newItem } : item));
        setEditingItem(null);
        setNewItem('');
      },
      (error) => console.error("Error updating item: ", error)
    );
  };

  const handleDeleteItem = async (itemId) => {
    firestore.deleteItemFromCategory(selectedCategory, itemId)
      .then(() => setItems(items.filter(item => item.id !== itemId)))
      .catch((error) => console.error("Error deleting item: ", error));
  };


  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
          <div className='header-page'>
          <header>
            <h1 >จัดการข้อมูล Index</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div className="main-contain">
                {/* Add component for manage data of dropdown*/}
                <FormControl fullWidth style={{ marginBottom: 20 }}>
              <InputLabel>เลือกหมวดหมู่</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="เพิ่มหมวดหมู่ใหม่"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="filled"
              style={{ marginBottom: 20 }}
            />
            <Button
              onClick={handleAddCategory}
              variant="contained"
              color="primary"
              style={{ marginBottom: 20 }}
            >
              เพิ่มหมวดหมู่
            </Button>
            {selectedCategory && (
              <div style={{ marginTop: 20 }}>
                <TextField
                  fullWidth
                  label="เพิ่มรายการใหม่"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  variant="filled"
                />
                <Button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 10 }}
                >
                  {editingItem ? 'อัปเดตรายการ' : 'เพิ่มรายการ'}
                </Button>
                <ul style={{ marginTop: 20 }}>
                  {items.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.name}</span>
                      <div>
                        <Button onClick={() => handleEditItem(item)}>แก้ไข</Button>
                        <Button onClick={() => handleDeleteItem(item.id)}>ลบ</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}    
          

            </div>
          </div>
        </main>
      
      
      </div>
      
    
  );
}

export default ManageIndex;

  