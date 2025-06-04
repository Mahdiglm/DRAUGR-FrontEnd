import React, { useRef, useEffect } from 'react';
import '../../styles/quill-dark.css';

const SimpleRichEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  
  // Initialize with the value from props
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);
  
  // Simple formatting function
  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    
    // Notify parent of change
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle content changes
  const handleChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  return (
    <div className="editor-container border border-gray-700 rounded-lg overflow-hidden">
      {/* Simple Toolbar */}
      <div className="bg-gray-800 p-2 border-b border-gray-700 flex flex-wrap gap-2">
        <button 
          type="button"
          onClick={() => handleFormat('bold')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Bold
        </button>
        <button 
          type="button"
          onClick={() => handleFormat('italic')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Italic
        </button>
        <button 
          type="button"
          onClick={() => handleFormat('underline')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Underline
        </button>
        <button 
          type="button"
          onClick={() => handleFormat('formatBlock', '<h2>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Heading
        </button>
        <button 
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          List
        </button>
        <button 
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) handleFormat('createLink', url);
          }}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Link
        </button>
        <button 
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) handleFormat('insertImage', url);
          }}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Image
        </button>
      </div>
      
      {/* Simple Editor */}
      <div
        ref={editorRef}
        contentEditable="true"
        onInput={handleChange}
        onBlur={handleChange}
        className="p-4 min-h-[250px] bg-gray-900 text-white outline-none"
        style={{ 
          direction: "ltr", // Force left-to-right to fix RTL issues
          textAlign: "left" 
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  );
};

export default SimpleRichEditor; 