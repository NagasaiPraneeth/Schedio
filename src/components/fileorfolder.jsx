import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DisplayFolders from './displayfolder';
import DisplayFile from './displayfiles';


const FileOrFolder = ({ fileName, path, name, contents, fileContents, setcde, openforpath, setopenforpath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isOpen === true) {
      setcde(null);
      if (!isFolder(contents) && openforpath === `${path}/${name}`) {
        setopenforpath('');
      }
    } else {
      if (!isFolder(contents)) {
        setopenforpath(`${path}/${name}`);
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isFolder(contents) && openforpath !== `${path}/${name}`) {
      setcde(null);
      setIsOpen(false);
    }
  }, [openforpath, path]);

  const isFolder = (contents) => {
    return typeof contents === 'object' && contents !== null;
  };

  let fullPath = path ? `${path}/${name}` : name;

  if (fullPath.startsWith(`${fileName}`)) {
    fullPath = fullPath.substring(`${fileName}`.length);
  }

  return (
    <div className='folder'>
      <div  className="folders" onClick={handleClick}>
        {isFolder(contents) ? (
          <img src="../folder.png" alt="Folder" style={{ width: '20px', marginRight: '5px' }} />
        ) : (
          <img src="../file (1).png" alt="File" style={{ width: '20px', marginRight: '5px' }} />
        )}
        <div className='p'> <p>{name} </p> </div>
      </div>
      {isOpen && isFolder(contents) && (
        <DisplayFolders contents={contents} fileContents={fileContents} fullPath={fullPath} setcde={setcde} setopenforpath={setopenforpath} openforpath={openforpath} />
      )}
      <div className="file">
        {isOpen && !isFolder(contents) && <DisplayFile fileContents={fileContents} fullPath={fullPath} setcde={setcde} />}
      </div>
    </div>
  );
};

export default FileOrFolder;
