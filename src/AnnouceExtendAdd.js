//AnnouceExtendAdd.js
import React, { useState, useCallback,useContext } from 'react';
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
import { UserContext } from './UserContext';



function AnnouceExtendAdd() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [link,setLink] = useState('');
  const [date,setDate] = useState(dayjs());
  const [detail,setDetail] = useState('');
  const [count,setCount] = useState(0);
  const [type,setType] = useState(1);

  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const { setCurrentUser, companyId } = useContext(UserContext);

  const types =[
   
    {label:'Relaxation',value:1},
    {label:'Health News',value:2},
    {label:'Climate Content',value:3},
    // {label:'ข่าวสารทั่วไป',value:4},
    // {label:'รณรงค์ลดโลกร้อน',value:5},
    // {label:'ปฏิทินวันหยุด',value:6}
  ]

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);


  const addAnnouceSuc=()=>{
    firestore.addAnnouceState(companyId,type)
    navigate('/annouce')
  }

  const addAnnouceUnsuc=(e)=>{
    console.log(e)
  }

  const handleSave = async () => {
    
  };

  const onSave = async () => {
    let date_str = date.format('DD/MM/YYYY');
  
    const uploadFiles = async () => {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          storage.uploadFile(companyId,
            file,
            (progress) => {
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: progress,
              }));
            },
            async (downloadURL) => {
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
        const downloadURLs = await Promise.all(uploadPromises);
        return downloadURLs;
      } catch (error) {
        console.error('Error uploading files: ', error);
        alert('Error uploading files');
        throw error;
      }
    };
  
    try {
      let fileURLs = [];
      if (files.length !== 0) {
        fileURLs = await uploadFiles();
        alert('Files uploaded and URLs saved to Firestore');
        setFiles([]);
        setUploadProgress({});
      }
  
      let item = {
        title: title,
        link: link,
        detail: detail,
        date: date_str,
        file: fileURLs.length ? fileURLs[0] : "",
        file_name: files.length ? files[0].name : "",
        count: count,
        type: type
      };
  
      await firestore.addAnnouce(companyId,item, addAnnouceSuc, addAnnouceUnsuc);
    } catch (error) {
      console.error('Error saving announcement: ', error);
    }
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

  const isRelaxType = type === 1;
  const isHealthType = type === 2;
  const isClimateType = type === 3;
//   const isGeneralType = type === 4;
//   const isCampaignType = type === 5;
//   const isHolidayType = type === 6;

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
            <div className="main-contain" style={{overflowX:'hidden'}}>
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
                        label="ลิงค์แนบ"
                        className="form-field"
                        variant="filled"
                        style={{width:'69%'}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        
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

export default AnnouceExtendAdd;

  