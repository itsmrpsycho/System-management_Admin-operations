
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'
// import { AiOutlineUpload } from 'react-icons/ai';

// const FileSelector = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileContent, setFileContent] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       setSelectedFile(file.name);

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const content = JSON.parse(e.target.result);
//           console.log('JSON file content:', content);
//           setFileContent(content);
//         } catch (error) {
//           console.error('Error parsing JSON file:', error);
//         }
//       };

//       reader.readAsText(file);
//     } else {
//       setSelectedFile(null);
//       setFileContent(null);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <div>
//         {selectedFile ? (
//           <p>Selected File: {selectedFile}</p>
//         ) : (
//           <p>No file selected</p>
//         )}
//         {fileContent && (
//           <div>
//             <p>JSON Content:</p>
//             <table border="1">
//               <thead>
//                 <tr>
//                   <th>Property</th>
//                   <th>Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(fileContent).map(([property, value]) => (
//                   <tr key={property}>
//                     <td>{property}</td>
//                     <td>{JSON.stringify(value)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <Link to={`/add-dataset/${encodeURIComponent(JSON.stringify(fileContent))}`}>
//         <button className='btn btn-primary mr-3' >
//           <AiOutlineUpload size={30}/>
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default FileSelector;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUpload } from 'react-icons/ai';
import './modelSelect.css'; // Import your CSS file for styling

const ModelSelector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          console.log('JSON file content:', content);
          setFileContent(content);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };

      reader.readAsText(file);
    } else {
      setSelectedFile(null);
      setFileContent(null);
    }
  };

  return (
    <div className="file-selector-container">
      <h2>Verify the Data and Click the Following Button</h2>
      <input type="file" onChange={handleFileChange} />
      <div className="file-info">
        {selectedFile ? (
          <p>Selected File: {selectedFile}</p>
        ) : (
          <p>No file selected</p>
        )}
        {fileContent && (
          <div>
            <p>JSON Content:</p>
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(fileContent).map(([property, value]) => (
                  <tr key={property}>
                    <td>{property}</td>
                    <td>{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="upload-button-container" >
        <Link to={`/add-dataModel/${encodeURIComponent(JSON.stringify(fileContent))}`}>
          <button className='btn btn-primary'>
            <AiOutlineUpload size={30} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ModelSelector;
