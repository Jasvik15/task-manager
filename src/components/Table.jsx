import EditableCell from './EditableCell';

const Table = ({ tasks, onUpdate, onDelete, isEditable = false, onAdd }) => {
  const statusOptions = ['Not Started', 'On Process', 'Completed'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return '#ffcccc';
      case 'On Process': return '#ffeb99';
      case 'Completed': return '#ccffcc';
      default: return 'white';
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        fontSize: isEditable ? '14px' : '18px',
        marginBottom: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Sl.No</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Machine No</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Target Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Remarks</th>
            {isEditable && <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isEditable ? (
                  <EditableCell
                    value={task.slNo}
                    onChange={(value) => onUpdate(task.id, 'slNo', value)}
                    type="text"
                  />
                ) : (
                  task.slNo
                )}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isEditable ? (
                  <EditableCell
                    value={task.machineNo}
                    onChange={(value) => onUpdate(task.id, 'machineNo', value)}
                    type="text"
                  />
                ) : (
                  task.machineNo
                )}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isEditable ? (
                  <EditableCell
                    value={task.description}
                    onChange={(value) => onUpdate(task.id, 'description', value)}
                    type="text"
                  />
                ) : (
                  task.description
                )}
              </td>
              <td style={{ 
                padding: '8px', 
                border: '1px solid #ddd',
                backgroundColor: getStatusColor(task.status)
              }}>
                {isEditable ? (
                  <EditableCell
                    value={task.status}
                    onChange={(value) => onUpdate(task.id, 'status', value)}
                    type="select"
                    options={statusOptions}
                  />
                ) : (
                  task.status
                )}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isEditable ? (
                  <EditableCell
                    value={task.targetDate}
                    onChange={(value) => onUpdate(task.id, 'targetDate', value)}
                    type="date"
                  />
                ) : (
                  task.targetDate
                )}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isEditable ? (
                  <EditableCell
                    value={task.remarks}
                    onChange={(value) => onUpdate(task.id, 'remarks', value)}
                    type="text"
                  />
                ) : (
                  task.remarks
                )}
              </td>
              {isEditable && (
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button 
                    onClick={() => onDelete(task.id)}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#ff4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditable && (
        <button 
          onClick={onAdd}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add New Task
        </button>
      )}
    </div>
  );
};

export default Table;