import { useState, useEffect } from 'react';

const EditableCell = ({ value, onChange, type = 'text', options = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (type === 'select') {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: '100%', padding: '4px' }}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    } else if (type === 'date') {
      return (
        <input
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: '100%', padding: '4px' }}
        />
      );
    } else {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: '100%', padding: '4px' }}
        />
      );
    }
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{ 
        padding: '8px', 
        minHeight: '20px', 
        cursor: 'pointer',
        border: '1px solid transparent'
      }}
      onMouseEnter={(e) => e.target.style.border = '1px solid #ccc'}
      onMouseLeave={(e) => e.target.style.border = '1px solid transparent'}
    >
      {value || 'Click to edit'}
    </div>
  );
};

export default EditableCell;