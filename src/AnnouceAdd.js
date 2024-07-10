import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import firestore from './Firebase/Firestore';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import './FilePicker.css';
import { useDropzone } from 'react-dropzone';
import storage from './Firebase/Storage';
import Layout from './Layout';
import { Label } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';



function AnnouceAdd() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [date,setDate] = useState(dayjs());
  const [detail,setDetail] = useState('');
  const [count,setCount] = useState(0);
  const [type,setType] = useState('');

  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const types =[
   
    {label:'ประกาศฉุกเฉิน',value:1},
    {label:'ข่าวสาร',value:2},
    {label:'กฎระเบียบ',value:3}
  ]

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);


  const addAnnouceSuc=()=>{
    navigate('/annouce')
  }

  const addAnnouceUnsuc=(e)=>{
    console.log(e)
  }

  const handleSave = async () => {
    
  };

  const onSave=async()=>{
    //let date_str = `${("0"+(date.get('date'))).slice(-2)}/${("0"+(date.month()+1)).slice(-2)}/${date.get('year')}`
    let date_str = date.format('DD/MM/YYYY');
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        storage.uploadFile(
          file,
          (progress) => {
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: progress,
            }));
          },
          async (downloadURL) => {
            let item={
              title:title,
              desc:desc,
              detail:detail,
              date:date_str,
              file:downloadURL,
              file_name:file.name,
              count:count,
            }
            await firestore.addAnnouce(item,addAnnouceSuc,addAnnouceUnsuc)
            resolve(downloadURL);
          },
          (error) => {
            console.error('Upload failed:', error);
            reject(error);
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      alert('Files uploaded and URLs saved to Firestore');
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Error uploading files: ', error);
      alert('Error uploading files');
    }
    /*let item={
      title:title,
      desc:desc,
      detail:detail,
      date:date_str,
      file:""
    }
    firestore.addAnnouce(item,addAnnouceSuc,addAnnouceUnsuc)*/
  }

  const removeFile = (file) => () => {
    setFiles(files.filter((f) => f !== file));
    setUploadProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      delete newProgress[file.name];
      return newProgress;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>เพิ่มประกาศ</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <div className='block_img'>
                {/* <img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" /> */}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <div  className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                  <TextField
                    label="หัวข้อ"
                    className="form-field"
                    variant="filled"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  
                   
                  
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                    <TextField
                        label="ประเภทประกาศ"
                        className="form-field"
                        select
                        variant="filled"
                        style={{width:'100%'}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >{types.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                      </TextField>
                    
                  
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        
                        <DatePicker
                        label="วันที่ลงประกาศ"
                        className="form-field"
                        sx={{
                          width: '30%',
                          '& .MuiInputBase-root': {
                            backgroundColor: '#fff',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#000',
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#000',
                          },marginRight:'1%'
                        }}
                        value={dayjs(date, 'dd/mm/yy')}
                        onChange={(newValue) => setDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="dd/MM/YYYY"
                        />
                
                    </LocalizationProvider>

                    <TextField
                        label="คำอธิบาย"
                        className="form-field"
                        variant="filled"
                        style={{width:'69%'}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
               
                    
                    
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                        label="รายละเอียด"
                        className="form-field"
                        variant="filled"
                        multiline
                        rows={4}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        style={{width:'100%'}}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    >
                    </TextField>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <div className="file-picker">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p style={{fontSize:22}}>Drag and drop some files here, or click to select files</p>
                  </div>
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <span>{Math.round(uploadProgress[file.name] || 0)}%</span>
                        <button onClick={removeFile(file)}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/annouce')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default AnnouceAdd;

  