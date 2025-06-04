import React, { useState, useEffect } from 'react';
import '../../styles/quill-dark.css';

const SimpleRichEditor = ({ value, onChange, placeholder }) => {
  const [htmlContent, setHtmlContent] = useState(value || '');
  
  // Update content when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setHtmlContent(value);
    }
  }, [value]);
  
  // Handle textarea input
  const handleChange = (e) => {
    const newContent = e.target.value;
    setHtmlContent(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
  };
  
  // Handle key presses, especially for Enter key
  const handleKeyDown = (e) => {
    // Handle Enter key to insert proper line break tags
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const textarea = document.getElementById('simple-editor');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const beforeSelection = htmlContent.substring(0, start);
      const afterSelection = htmlContent.substring(end);
      
      // Insert <br> tag for HTML rendering
      const newContent = beforeSelection + '<br>\n' + afterSelection;
      setHtmlContent(newContent);
      
      if (onChange) {
        onChange(newContent);
      }
      
      // Set focus back to textarea and restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + 5; // 5 is the length of '<br>\n'
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
      
      return false;
    }
  };
  
  // Insert HTML tag at cursor position or wrap selection
  const insertTag = (openTag, closeTag) => {
    const textarea = document.getElementById('simple-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = htmlContent.substring(start, end);
    const beforeSelection = htmlContent.substring(0, start);
    const afterSelection = htmlContent.substring(end);
    
    // Create the new content with the tags
    const newContent = beforeSelection + openTag + selectedText + closeTag + afterSelection;
    setHtmlContent(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
    
    // Set focus back to textarea and restore cursor position
    setTimeout(() => {
      textarea.focus();
      // Position cursor after the inserted content
      const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  return (
    <div className="editor-container border border-gray-700 rounded-lg overflow-hidden">
      {/* Simple Toolbar */}
      <div className="bg-gray-800 p-2 border-b border-gray-700 flex flex-wrap gap-2">
        <button 
          type="button"
          onClick={() => insertTag('<strong>', '</strong>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Bold
        </button>
        <button 
          type="button"
          onClick={() => insertTag('<em>', '</em>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Italic
        </button>
        <button 
          type="button"
          onClick={() => insertTag('<u>', '</u>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Underline
        </button>
        <button 
          type="button"
          onClick={() => insertTag('<h2>', '</h2>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Heading
        </button>
        <button 
          type="button"
          onClick={() => insertTag('<li>', '</li>')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          List Item
        </button>
        <button 
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) insertTag(`<a href="${url}">`, '</a>');
          }}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Link
        </button>
        <button 
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) insertTag(`<img src="${url}" alt="Image" />`, '');
          }}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Image
        </button>
      </div>
      
      {/* Simple Textarea */}
      <textarea
        id="simple-editor"
        value={htmlContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="p-4 min-h-[250px] w-full bg-gray-900 text-white outline-none font-mono text-base"
        style={{ 
          direction: "ltr",
          textAlign: "left",
          resize: "vertical" 
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SimpleRichEditor; 