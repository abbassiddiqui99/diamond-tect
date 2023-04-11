import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FILE_TYPES, MAX_FILES, MAX_SIZE } from 'src/constant/DropzoneConstants';
import { DropzoneType } from 'src/types';

const Dropzone: React.FC<DropzoneType> = ({ maxFiles, maxSize, acceptedTypes, onChange, children }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: acceptedTypes || FILE_TYPES,
    maxSize: maxSize || MAX_SIZE,
    maxFiles: maxFiles || MAX_FILES,
  });

  React.useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onChange(acceptedFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  return (
    <section className='h-64 transition bg-gray-100 cursor-pointer hover:bg-gray-200 rounded-3xl'>
      <div {...getRootProps({ className: 'flex-center h-full' })}>
        <input {...getInputProps()} />
        <div className='dropzone__elements'>{children}</div>
      </div>
    </section>
  );
};

export default Dropzone;
