import React, { useState, useRef, useEffect } from 'react';
import '../../styles/quill-dark.css';

const SimpleRichEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [selection, setSelection] = useState(null);
  const [internalValue, setInternalValue] = useState(value || '');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    ul: false,
    ol: false
  });
  
  // Sync from props to internal state only when not focused
  useEffect(() => {
    if (!focus && value !== internalValue) {
      setInternalValue(value || '');
    }
  }, [value, focus]);
  
  // Sync internal content with contentEditable div
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== internalValue && !focus) {
      editorRef.current.innerHTML = internalValue;
    }
  }, [internalValue, focus]);

  // When user types or edits
  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setInternalValue(newContent);
      
      if (onChange) {
        onChange(newContent);
      }
    }
    
    // Check active formats after content changes
    checkActiveFormats();
  };
  
  // Add proper paragraph handling
  const handleKeyDown = (e) => {
    // Handle Tab key to prevent focus loss
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      handleInput();
    }
    
    // Ensure proper paragraph handling for Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're in a special block like list
      const inList = document.queryCommandState('insertOrderedList') || 
                    document.queryCommandState('insertUnorderedList');
                    
      if (!inList) {
        // In normal text, use standard paragraph creation
        e.preventDefault();
        document.execCommand('insertParagraph', false, null);
        handleInput();
      }
    }
  };
  
  // Save selection before any action
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0).cloneRange();
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
    
    // Keep focus on the editor and save the new selection
    editorRef.current.focus();
    setSelection(saveSelection());
  };

  // Special handler for headings that works better
  const formatHeading = (level) => {
    editorRef.current.focus();
    
    if (selection) {
      restoreSelection(selection);
    }

    // Check if we're already using this heading level
    const isActive = activeFormats[level];
    
    // First clear any existing format
    document.execCommand('formatBlock', false, 'div');
    
    // Then apply heading format (only if not already active)
    if (!isActive) {
      document.execCommand('formatBlock', false, level);
    }
    
    // Update content and selection
    handleInput();
    editorRef.current.focus();
    setSelection(saveSelection());
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
  
  // Handle selection change to track it
  const handleSelectionChange = () => {
    if (document.activeElement === editorRef.current) {
      setSelection(saveSelection());
      // Also check formatting when selection changes
      checkActiveFormats();
    }
  };
  
  // Add event listener for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);
  
  // Handle initial paragraph structure
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = '<p><br></p>';
    }
  }, []);
  
  // Prepare initial content for proper paragraph structure
  const getInitialContent = () => {
    if (!internalValue) return '<p><br></p>';
    
    // Check if the content already has block elements
    if (/<\/?[p|div|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote]/.test(internalValue)) {
      return internalValue;
    }
    
    // Wrap plain text in paragraph
    return `<p>${internalValue}</p>`;
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
        className="ql-editor bg-gray-800 text-gray-200 border border-gray-700 rounded-b-lg p-4 min-h-[250px]"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFocus(true);
          checkActiveFormats();
        }}
        onBlur={() => {
          setFocus(false);
          // Keep selection for a short while to allow button clicks to work
          setTimeout(() => {
            setSelection(null);
          }, 100);
        }}
        style={{ minHeight: '250px' }}
        dangerouslySetInnerHTML={{ __html: getInitialContent() }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default SimpleRichEditor; 