import React, { useState,useEffect,useCallback,useContext } from 'react';
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
import Layout from './Layout';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from './UserContext';


function AnnouceExtendEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRelaxSender, setIsRelaxSender] = useState(false);
  const [title,setTitle] = useState('');
  const [link,setLink] = useState('');
  const [date,setDate] = useState(dayjs());
  const [detail,setDetail] = useState('');
  const [selectID,setSelectID] = useState('');
  const [fileName,setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [type,setType] = useState('');
  const [count,setCount] =useState(null);

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
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept only image files
    maxFiles: 1,      // Limit to one file
  });



  const getAnnouceSuc=(data)=>{
    console.log(data)
    setTitle(data.title)
    setLink(data.link)
    setDate(dayjs(data.date,'DD-MM-YYYY'))
    setDetail(data.detail)
    setFileName(data.file_name)
    setFileURL(data.file)
    setType(data.type)
    setCount(data.count)
  }

  const getAnnouceUnsuc=(e)=>{
    console.log('f edit'+e)
  }

  const updateAnnouceSuc=()=>{
    //firestore.addAnnouceState(companyId,type)
    alert('Update Successful.')
    navigate('/annouce_extend')
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
    link: link,
    date: date_str,
    file: fileURL,
    file_name: fileName,
    type:type,
  };

  if (files.length > 0) {
    const file = files[0];
    await deleteFile(fileURL); // Delete the existing file before uploading the new one

    storage.uploadFile(companyId,
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
        await firestore.updateAnnouceHome2(companyId,selectID, item, updateAnnouceSuc, updateAnnouceUnsuc);
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );
  } else {
    firestore.updateAnnouceHome2(companyId,selectID, item, updateAnnouceSuc, updateAnnouceUnsuc);
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
      console.log('from eff '+location.state.id)
      firestore.getAnnouceHome2(companyId,location.state.id,getAnnouceSuc,getAnnouceUnsuc)
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

  //const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const isRelaxType = type === 1;
  const isHealthType = type === 2;
  const isClimateType = type === 3;

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>แก้ไขประกาศ</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain" style={{overflowX:'hidden'}}>
              <div className='block_img'>
                {/* <img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" /> */}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                {/* <div  className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
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
                </div> */}
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                    <TextField
                        label="ประเภทประกาศ"
                        className="form-field"
                        select
                        variant="filled"
                        style={{width:'100%'}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        
                        value={type}
                        onChange={(e) => {
                          if (!isRelaxSender) {
                            setType(e.target.value);
                          }
                          // Clear or reset dependent state when type changes
                          setFiles([]);       // Reset the files array
                          setLink('');        // Clear the link field
                          setTitle('');       // Clear the title field
                          setDetail('');      // Clear the detail field
                          setCount(0);        // Reset the count field, if applicable
                        }}
                        disabled={isRelaxSender}
                    >{types
                      .filter((option) => isRelaxSender || option.value !== 1) // Exclude Relaxation for 'other' sender
                      .map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                      </TextField>
                    
    
                </div>
                {(type==2||type==3) &&
                  <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                    
                      <TextField
                        label="หัวข้อ"
                        className="form-field"
                        variant="filled"
                        style={{width:'100%',marginBottom:20}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        
                      />
                   
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
                    {/* type==2||type==3 */}
                    <div className="file-picker" style={{ marginTop: 20 }}>
                    {fileURL && (
                      <div 
                        className="old-file" 
                        style={{ 
                          marginBottom: 10, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          border: '1px solid #BEBEBE', 
                          padding: '10px', 
                          borderRadius: '4px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <span style={{flex:1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          Current File: {fileName}
                        </span>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          {fileURL && (
                            <a
                              href={fileURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'underline', color: '#007BFF' }}
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() => {
                              removeExistingFile();
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#FF0000',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    )}

                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p style={{ fontSize: 22 }}>Drag and drop an preview image file here, or click to select one.</p>
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
                  }
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/annouce_extend')}>กลับ</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default AnnouceExtendEdit;

  