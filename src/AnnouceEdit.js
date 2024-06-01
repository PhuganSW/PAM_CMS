import React, { useState,useEffect,useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import firestore from './Firebase/Firestore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import './FilePicker.css';
import { useDropzone } from 'react-dropzone';
import storage from './Firebase/Storage';



function AnnouceEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [date,setDate] = useState(dayjs());
  const [detail,setDetail] = useState('');
  const [selectID,setSelectID] = useState('');
  const [fileName,setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');

  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  
  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);



  const getAnnouceSuc=(data)=>{
    setTitle(data.title)
    setDesc(data.desc)
    setDate(dayjs(data.date,'DD-MM-YYYY'))
    setDetail(data.detail)
    setFileName(data.file_name)
    setFileURL(data.file)
  }

  const getAnnouceUnsuc=(e)=>{
    console.log('f edit'+e)
  }

  const updateAnnouceSuc=()=>{
    navigate('/annouce')
  }

  const updateAnnouceUnsuc=(error)=>{
    console.log(error)
  }

  const deleteFile = async (url) => {
    storage.deleteFile(url);
  };

  const onSave=async()=>{
   // let date_str = `${("0"+(date.get('date'))).slice(-2)}/${("0"+(date.month()+1)).slice(-2)}/${date.get('year')}`
   let date_str = date.format('DD/MM/YYYY');
   let item = {
    title: title,
    desc: desc,
    detail: detail,
    date: date_str,
    file: fileURL,
    file_name: fileName,
  };

  if (files.length > 0) {
    const file = files[0];
    await deleteFile(fileURL); // Delete the existing file before uploading the new one

    storage.uploadFile(
      file,
      (progress) => {
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: progress,
        }));
      },
      async (downloadURL) => {
        item.file = downloadURL;
        item.file_name = file.name;
        await firestore.updateAnnouce(selectID, item, updateAnnouceSuc, updateAnnouceUnsuc);
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );
  } else {
    firestore.updateAnnouce(selectID, item, updateAnnouceSuc, updateAnnouceUnsuc);
  }
  }

  const removeExistingFile = async () => {
    await deleteFile(fileURL);
    setFileName('');
    setFileURL('');
  };


  useEffect(() => {
    if (location.state && location.state.id) {
      setSelectID(location.state.id);
      //console.log('from eff'+uid)
      firestore.getAnnouce(location.state.id,getAnnouceSuc,getAnnouceUnsuc)
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);

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
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>แก้ไขประกาศ</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
              <div className='block_img'>
                {/*<img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />*/}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center'}}>
                <div style={{ gap: '10px', marginBottom: '20px'}}>
                  <TextField
                    label="หัวข้อ"
                    variant="filled"
                    style={{width:'100%',marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        
                        <DatePicker
                        label="วันที่ลงประกาศ"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        />
                
                    </LocalizationProvider>

                    <TextField
                        label="คำอธิบาย"
                        variant="filled"
                        style={{width:400,marginRight:10,marginLeft:10}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
               
                    <TextField
                        label="รายละเอียด"
                        variant="filled"
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        style={{width:300,marginRight:10}}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    >
                    </TextField>
                    
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                <div className="file-picker">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop some files here, or click to select files</p>
                  </div>
                  <div className="file-list">
                  {files.length > 0 ? (
                      files.map((file, index) => (
                        <div key={index} className="file-item">
                          <span>{file.name}</span>
                          <span>{Math.round(uploadProgress[file.name] || 0)}%</span>
                          <button onClick={removeFile(file)}>Remove</button>
                        </div>
                      ))
                    ) : (
                      fileName && (
                        <div className="file-item">
                          <a href={fileURL} target="_blank" rel="noopener noreferrer">
                            {fileName}
                          </a>
                          <button onClick={removeExistingFile}>Remove</button>
                        </div>
                      )
                    )}
                  </div>
                </div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/annouce')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default AnnouceEdit;

  