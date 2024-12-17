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
  const [relaxQuote1,setRelaxQuote1] = useState('')
  const [relaxQuote2,setRelaxQuote2] = useState('')
  const [relaxQuote3,setRelaxQuote3] = useState('')
  const [relaxQuote4,setRelaxQuote4] = useState('')
  const [relaxPic1,setRelaxPic1] = useState('')
  const [relaxPic2,setRelaxPic2] = useState('')
  const [relaxPic3,setRelaxPic3] = useState('')
  const [relaxPic4,setRelaxPic4] = useState('')
  const [isUploading, setIsUploading] = useState(false);

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
    if (acceptedFiles.length > 1) {
      alert("You can only upload one file.");
      return;
    }
    
    const isImage = acceptedFiles.every((file) => file.type.startsWith("image/"));
    if (!isImage) {
      alert("Only image files are allowed.");
      return;
    }
  
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept only image files
    maxFiles: 1,      // Limit to one file
  });


  const addAnnouceSuc=()=>{
    //firestore.addAnnouceState(companyId,type)
    navigate('/annouce_extend')
  }

  const addAnnouceUnsuc=(e)=>{
    console.log(e)
  }

  const handleSave = async () => {
    
  };

  const onSave = async () => {
    let date_str = date.format('DD/MM/YYYY');
    
    const uploadFiles = async (files) => {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          console.log("File to upload:", file);
          console.log("File size:", file.size);
            if (file.size === 0) {
              throw new Error("File size is 0. Cannot upload empty file.");
            }
          storage.uploadFile(
            companyId,
            file,
            (progress) => {
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: progress,
              }));
            },
            async (downloadURL) => {
              resolve({ name: file.name, url: downloadURL });
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            }
          );
          console.log("Files array:", files);
        });
      });
  
      try {
        const uploadedFiles = await Promise.all(uploadPromises);
        return uploadedFiles;
      } catch (error) {
        console.error("Error uploading files: ", error);
        alert("Error uploading files");
        throw error;
      }
    };
    
    try {
      let item = {};
      if (type === 1) {
        // Upload images for Relaxation
        const uploadedImages = await uploadFiles(files.filter((file) => file));
        item = {
          relaxQuote1,
          relaxQuote2,
          relaxQuote3,
          relaxQuote4,
          relaxPic1: uploadedImages[0]?.name || "",
          relaxPic2: uploadedImages[1]?.name || "",
          relaxPic3: uploadedImages[2]?.name || "",
          relaxPic4: uploadedImages[3]?.name || "",
          Pic1url: uploadedImages[0]?.url || "",
          Pic2url: uploadedImages[1]?.url || "",
          Pic3url: uploadedImages[2]?.url || "",
          Pic4url: uploadedImages[3]?.url || "",
          type,
        };
      } else if (type === 2 || type === 3) {
        // Upload single file for Health News or Climate Content
        const uploadedFiles = await uploadFiles(files);
        item = {
          title,
          link,
          date: date_str,
          file: uploadedFiles[0]?.url || "",
          file_name: uploadedFiles[0]?.name || "",
          type,
        };
      }
  
      // Save to Firestore
      await firestore.addAnnouceHome2(companyId, type, item, addAnnouceSuc, addAnnouceUnsuc);
    } catch (error) {
      console.error("Error saving announcement: ", error);
    }
  };
  
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
                          setType(e.target.value);
                      
                          // Clear or reset dependent state when type changes
                          setFiles([]);       // Reset the files array
                          setLink('');        // Clear the link field
                          setTitle('');       // Clear the title field
                          setDetail('');      // Clear the detail field
                          setCount(0);        // Reset the count field, if applicable
                        }}
                    >{types.map((option) => (
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
                {type==1 && (<div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                  <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Relax-Quote</p>
                  <TextField
                        label="Quote 1"
                        className="form-field"
                        variant="filled"
                        style={{width:'100%',marginBottom:10}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={relaxQuote1}
                        onChange={(e) => setRelaxQuote1(e.target.value)}
                        
                    />
                    <TextField
                        label="Quote 2"
                        className="form-field"
                        variant="filled"
                        style={{width:'100%',marginBottom:10}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={relaxQuote2}
                        onChange={(e) => setRelaxQuote2(e.target.value)}
                        
                    />
                    <TextField
                        label="Quote 3"
                        className="form-field"
                        variant="filled"
                        style={{width:'100%',marginBottom:10}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={relaxQuote3}
                        onChange={(e) => setRelaxQuote3(e.target.value)}
                        
                    />
                    <TextField
                        label="Quote 4"
                        className="form-field"
                        variant="filled"
                        style={{width:'100%',marginBottom:20}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={relaxQuote4}
                        onChange={(e) => setRelaxQuote4(e.target.value)}
                        
                    />
                    <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Relax-Pic</p>
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={`relax-pic-${index}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          marginBottom: 10,
                          position: 'relative',
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`relax-pic-input-${index}`}
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const file = e.target.files[0];
                              setFiles((prevFiles) => {
                                const updatedFiles = [...prevFiles];
                                updatedFiles[index] = e.target.files[0]; // Store original File object
                                return updatedFiles;
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`relax-pic-input-${index}`}
                          style={{
                            width: '100%',
                            height: '56px',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            padding: '12px',
                            cursor: 'pointer',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span
                            style={{
                              color: '#000',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {files[index]?.name || `Select Image ${index + 1}`}
                          </span>
                          {files[index] && (
                            <a
                              href={URL.createObjectURL(files[index])} // Generate preview dynamically
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#007BFF',
                                textDecoration: 'underline',
                                marginRight: 10,
                              }}
                            >
                              View
                            </a>
                          )}
                          {files[index] && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFiles((prevFiles) => {
                                  const updatedFiles = [...prevFiles];
                                  updatedFiles[index] = null;
                                  return updatedFiles;
                                });
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                marginLeft: 10,
                              }}
                            >
                              <span
                                style={{
                                  border: '1px solid #FF0000',
                                  borderRadius: '50%',
                                  padding: '4px',
                                  color: '#FF0000',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '20px',
                                  height: '20px',
                                }}
                              >
                                X
                              </span>
                            </button>
                          )}
                        </label>
                      </div>
                    ))}
                    <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Relax-Clip</p>
                </div>
                
              )}

                {/* <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
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
                </div> */}

                {/* <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
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
                </div> */}
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

export default AnnouceExtendAdd;

  