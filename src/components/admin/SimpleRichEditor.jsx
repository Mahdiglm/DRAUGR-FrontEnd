import React, { useState, useRef, useEffect } from 'react';
import '../../styles/quill-dark.css';

const SimpleRichEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [selection, setSelection] = useState(null);
  
  // Sync the value prop with the contentEditable element
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !focus) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, focus]);
  
  // Handle content changes
  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  // Save selection before any action
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }
    return null;
  };
  
  // Restore selection after action
  const restoreSelection = (range) => {
    if (range && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  
  // Apply formatting with proper selection handling
  const execFormatCommand = (command, value = null) => {
    // Focus the editor first
    editorRef.current.focus();
    
    // If we have a saved selection, restore it
    if (selection) {
      restoreSelection(selection);
    }
    
    // Execute the command
    document.execCommand(command, false, value);
    
    // Update the content
    handleInput();
    
    // Keep focus on the editor
    editorRef.current.focus();
  };
  
  // Handle selection change to track it
  const handleSelectionChange = () => {
    if (document.activeElement === editorRef.current) {
      setSelection(saveSelection());
    }
  };
  
  // Add event listener for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);
  
  return (
    <div className="rich-editor-container">
      {/* Formatting Toolbar */}
      <div className="ql-toolbar">
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            title="Heading 1" 
            onClick={() => execFormatCommand('formatBlock', 'h1')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm"
          >
            H1
          </button>
          <button 
            type="button"
            title="Heading 2" 
            onClick={() => execFormatCommand('formatBlock', 'h2')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm"
          >
            H2
          </button>
          <button 
            type="button"
            title="Bold" 
            onClick={() => execFormatCommand('bold')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button"
            title="Italic" 
            onClick={() => execFormatCommand('italic')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            <em>I</em>
          </button>
          <button 
            type="button"
            title="Underline" 
            onClick={() => execFormatCommand('underline')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            <u>U</u>
          </button>
          <button 
            type="button"
            title="Bullet List" 
            onClick={() => execFormatCommand('insertUnorderedList')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            • List
          </button>
          <button 
            type="button"
            title="Numbered List" 
            onClick={() => execFormatCommand('insertOrderedList')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            1. List
          </button>
          <button 
            type="button"
            title="Link" 
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execFormatCommand('createLink', url);
            }}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Link
          </button>
          <button 
            type="button"
            title="Image" 
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) execFormatCommand('insertImage', url);
            }}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Image
          </button>
          <button 
            type="button"
            title="Clear Formatting" 
            onClick={() => execFormatCommand('removeFormat')}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="ql-editor bg-gray-800 text-gray-200 border border-gray-700 rounded-b-lg p-4 min-h-[250px]"
        onInput={handleInput}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          setSelection(null);
        }}
        style={{ minHeight: '250px' }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  );
};

export default SimpleRichEditor; 