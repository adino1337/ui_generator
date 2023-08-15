import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import schema from './schemas/schema_2.json'

function App() {
  const initialFields = schema

  const [leftFields, setLeftFields] = useState(initialFields);
  const [rightFields, setRightFields] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
  
    if (sourceList === destinationList) {
      // Presúvame v rámci toho istého zoznamu
      if (sourceList === 'left-list') {
        const updatedFields = Array.from(leftFields);
        const [movedField] = updatedFields.splice(result.source.index, 1);
        updatedFields.splice(result.destination.index, 0, movedField);
        setLeftFields(updatedFields);
      } else {
        const updatedFields = Array.from(rightFields);
        const [movedField] = updatedFields.splice(result.source.index, 1);
        updatedFields.splice(result.destination.index, 0, movedField);
        setRightFields(updatedFields);
      }
    } else {
      // Presúvame z jedného zoznamu do druhého
      const sourceFields = sourceList === 'left-list' ? leftFields : rightFields;
      const destinationFields = destinationList === 'left-list' ? leftFields : rightFields;
  
      const [movedField] = sourceFields.splice(result.source.index, 1);
      destinationFields.splice(result.destination.index, 0, movedField);
  
      setLeftFields([...leftFields]);
      setRightFields([...rightFields]);
    }
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', width: '100%', minHeight: "calc(100vh - 20px)"}}>
          <Droppable droppableId="left-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  minHeight: "calc(100vh - 20px)",
                  width: '20%',
                  height: '100%',
                  background: 'blue',
                  padding: 10,
                  gap: "10px",
                  display: "flex",
                  flexDirection: "column"

                }}
                {...provided.droppableProps}
              >
                {leftFields.map((field, index) => (
                  <Draggable key={field.field} draggableId={field.field} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: '10px',
                          width: "calc(100% - 20px)",
                          backgroundColor: 'white',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {field.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div 
          style={{
            width: '100%',
            minHeight: "calc(100vh - 20px)",
            background: 'red',
            padding: 10,
            display: 'flex',
            
            gap: '10px'
          }}
          >
          <Droppable droppableId="right-list" direction='horizontal'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  background: 'green',
                  height: 'fit-content',
                  minHeight: '40px',
                  minWidth: '40px',
                  padding: 10,
                  display: 'flex',
                  gap: '10px'
                }}
                {...provided.droppableProps}
              >
                {rightFields.map((field, index) => (
                  <Draggable key={field.field} draggableId={field.field} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          minWidth: '150px',
                          textAlign: "center",
                          padding: '10px',
                          backgroundColor: 'white',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {field.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          </div>
          
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
