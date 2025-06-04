import React, { useState, useRef, useEffect } from 'react';
import '../../styles/quill-dark.css';

const SimpleRichEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [editorContent, setEditorContent] = useState(value || '');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    ul: false,
    ol: false
  });
  
  // Only update the content from props when it's explicitly changed from outside
  useEffect(() => {
    if (!focus && value !== editorContent) {
      setEditorContent(value || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, focus]);
  
  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      // Only trigger onChange if the content actually changed
      if (newContent !== value && onChange) {
        onChange(newContent);
      }
    }
    
    // Check active formats
    checkActiveFormats();
  };
  
  // Apply formatting with proper selection handling
  const execFormatCommand = (command, value = null) => {
    // Focus the editor first
    editorRef.current.focus();
    
    // Use the browser's built-in formatting command
    document.execCommand(command, false, value);
    
    // Update our state after formatting
    handleInput();
  };

  // Special handler for headings that works better
  const formatHeading = (level) => {
    // Focus the editor first
    editorRef.current.focus();

    // Check if we're already using this heading level
    const isActive = activeFormats[level];
    
    // First clear any existing format
    document.execCommand('formatBlock', false, 'div');
    
    // Then apply heading format (only if not already active)
    if (!isActive) {
      document.execCommand('formatBlock', false, level);
    }
    
    // Update our state after formatting
    handleInput();
  };

  // Check which formats are currently active
  const checkActiveFormats = () => {
    if (!document.queryCommandEnabled('bold')) {
      return; // Editor not focused or not available
    }
    
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
      // For headings, we need a different approach
      h1: isFormatActive('h1'),
      h2: isFormatActive('h2'),
    });
  };

  // Helper to check if a specific block format is active
  const isFormatActive = (format) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const node = selection.getRangeAt(0).commonAncestorContainer;
      const element = node.nodeType === 3 ? node.parentNode : node;
      
      // Walk up from the selection to check for the format
      let current = element;
      while (current && current !== editorRef.current) {
        if (current.nodeName.toLowerCase() === format) {
          return true;
        }
        current = current.parentNode;
      }
    }
    return false;
  };
  
  return (
    <div className="rich-editor-container">
      {/* Formatting Toolbar */}
      <div className="ql-toolbar">
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            type="button"
            title="Heading 1" 
            onClick={() => formatHeading('h1')}
            className={`px-4 py-1.5 rounded text-sm ${activeFormats.h1 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            H1
          </button>
          <button 
            type="button"
            title="Heading 2" 
            onClick={() => formatHeading('h2')}
            className={`px-4 py-1.5 rounded text-sm ${activeFormats.h2 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            H2
          </button>
          <button 
            type="button"
            title="Bold" 
            onClick={() => execFormatCommand('bold')}
            className={`px-4 py-1.5 rounded ${activeFormats.bold 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <strong>B</strong>
          </button>
          <button 
            type="button"
            title="Italic" 
            onClick={() => execFormatCommand('italic')}
            className={`px-4 py-1.5 rounded ${activeFormats.italic 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <em>I</em>
          </button>
          <button 
            type="button"
            title="Underline" 
            onClick={() => execFormatCommand('underline')}
            className={`px-4 py-1.5 rounded ${activeFormats.underline 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            <u>U</u>
          </button>
          <button 
            type="button"
            title="Bullet List" 
            onClick={() => execFormatCommand('insertUnorderedList')}
            className={`px-4 py-1.5 rounded ${activeFormats.ul 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            • List
          </button>
          <button 
            type="button"
            title="Numbered List" 
            onClick={() => execFormatCommand('insertOrderedList')}
            className={`px-4 py-1.5 rounded ${activeFormats.ol 
              ? 'bg-red-900 text-white' 
              : 'bg-gray-800 hover:bg-gray-700'}`}
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
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
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
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Image
          </button>
          <button 
            type="button"
            title="Clear Formatting" 
            onClick={() => execFormatCommand('removeFormat')}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="ql-editor bg-gray-800 text-gray-200 border border-gray-700 rounded-b-lg p-4 min-h-[250px]"
        onInput={handleInput}
        onFocus={() => {
          setFocus(true);
          checkActiveFormats();
        }}
        onBlur={() => {
          setFocus(false);
          // Last chance to make sure content is synced
          handleInput();
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: editorContent }}
      />
    </div>
  );
};

export default SimpleRichEditor; 