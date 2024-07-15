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

  const cate =[
    {label:'คำนำหน้าชื่อ',value:'prefixTh'},
    {label:'คำนำหน้าภาษาอังกฤษ',value:'prefixEn'},
    {label:'เพศ',value:'sex'},
    {label:'ตำแหน่ง',value:'position'},
    {label:'สถานภาพ',value:'status_per'},
    {label:'บัญชีธนาคาร',value:'bank'},
    {label:'พื้นที่ปฏิบัติงาน',value:'workplace'},
  ]
  

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

    handleAddCategory()

    return unsubscribe; // Cleanup listener on category change
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
    firestore.addCategory(
      newCategory,
      (categoryId) => {
        // setCategories([...categories, { id: categoryId, name: newCategory }]);
        setCategories([...categories, { id: categoryId, name: selectedCategory }]);
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
                <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%',marginTop:30}}>
                <FormControl fullWidth style={{ marginBottom: 20 }}>
              <InputLabel id="category-select-label">เลือกหมวดหมู่</InputLabel>
              <Select labelId="category-select-label" value={selectedCategory} onChange={handleCategoryChange}  label="เลือกหมวดหมู่">
                {/* {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))} */}
                {cate.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* <TextField
              fullWidth
              label="เพิ่มหมวดหมู่ใหม่"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="filled"
              style={{ marginBottom: 20 }}
            />
            <button
              onClick={handleAddCategory}
              className='Add-button'
              variant="contained"
              style={{ marginBottom: 20 }}
            >
              เพิ่มหมวดหมู่
            </button> */}
            {selectedCategory && (
              <div style={{ marginTop: 20 }}>
                <TextField
                  className='form-field'
                  fullWidth
                  label="เพิ่มรายการใหม่"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  variant="filled"
                />
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className='Edit-button'
                  style={{marginTop:20,marginLeft:0}}
                  variant="contained"
                  
                >
                  {editingItem ? 'อัปเดตรายการ' : 'เพิ่มรายการ'}
                </button>
                <ul style={{ marginTop: 20, width:'100%',alignItems:'center' }}>
                  {items.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:20}}>
                      <div style={{width:'100%',display:'flex',flexDirection:'row',}}>{item.name}</div>
                      <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <button className='Edit-button' onClick={() => handleEditItem(item)}>แก้ไข</button>
                        <button className='Delete-button' onClick={() => handleDeleteItem(item.id)}>ลบ</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}    
          
            </div>
            </div>
          </div>
        </main>
      
      
      </div>
      
    
  );
}

export default ManageIndex;

  