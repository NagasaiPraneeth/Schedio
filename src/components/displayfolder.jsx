import React, { useState } from 'react';
import FileOrFolder from './fileorfolder';

const DisplayFolders = ({contents,fileContents,fullPath,setcde,setopenforpath,openforpath}) => {
    return (
      <div className='folderrs'>
        <div className="folderr" style={{ marginLeft: '20px' }}>
        {Object.entries(contents).map(([itemName, subContents]) => (
          <FileOrFolder
            key={itemName}
            path={fullPath}
            name={itemName}
            contents={subContents}
            fileContents={fileContents}
            setcde={setcde}
            setopenforpath={setopenforpath}
            openforpath={openforpath}
          />
        ))}
        </div>
      </div>
      
    );
  };
  export default DisplayFolders;