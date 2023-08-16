import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import schema from './schemas/schema_2.json'

function App() {
  const initialFields = schema

  const [leftFields, setLeftFields] = useState(initialFields);
  const [marks, setMarks] = useState([[[]]])
  const [activeMark, setActiveMark] = useState(0)
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
  
  const update = () => {
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups; 
    setMarks(updatedMarks);     
  }
  const onDragEnd = (result) => {
    update()
    if (!result.destination) return;
  
    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
  
    if (sourceList === destinationList) {
      if (sourceList === 'left-list') {
        const updatedFields = Array.from(leftFields);
        const [movedField] = updatedFields.splice(result.source.index, 1);
        updatedFields.splice(result.destination.index, 0, movedField);
        setLeftFields(updatedFields);
      } else {
        const updatedGroups = [...rightFieldGroups];
        const groupIndex = parseInt(sourceList.split('-')[1]);
        const updatedGroup = [...updatedGroups[groupIndex]];
        const [movedField] = updatedGroup.splice(result.source.index, 1);
        updatedGroup.splice(result.destination.index, 0, movedField);
        updatedGroups[groupIndex] = updatedGroup;
        setRightFieldGroups(updatedGroups);
      }
    } else {
      const sourceFields = sourceList === 'left-list' ? leftFields : rightFieldGroups[parseInt(sourceList.split('-')[1])];
      const destinationFields = destinationList === 'left-list' ? leftFields : rightFieldGroups[parseInt(destinationList.split('-')[1])];
  
      const [movedField] = sourceFields.splice(result.source.index, 1);
      destinationFields.splice(result.destination.index, 0, movedField);
  
      if (sourceList === 'left-list') {
        setLeftFields([...sourceFields]);
      } else {
        let updatedGroups = [...rightFieldGroups];
        const sourceGroupIndex = parseInt(sourceList.split('-')[1]);
        const destinationGroupIndex = parseInt(destinationList.split('-')[1]);
        updatedGroups[sourceGroupIndex] = sourceFields;
        updatedGroups[destinationGroupIndex] = destinationFields;
        updatedGroups = updatedGroups.filter(group => group.length > 0);
        setRightFieldGroups(updatedGroups);
      }
    }    
  };
  
  if (rightFieldGroups.length === 0) {
    const updatedGroups = [[]]; 
    setRightFieldGroups(updatedGroups);
  }

  const addNewFieldGroup = () => {
    const newFieldGroup = [];
    setRightFieldGroups([...rightFieldGroups, newFieldGroup]);
  };

  const deleteMark = (index) => {
    if(marks.length !== 1){
    const updatedMarks = [...marks];
    updatedMarks.splice(index, 1);
    setMarks(updatedMarks);
     console.log(index)
    if (index === activeMark) {
      setActiveMark(0); 
    }
  }
  };
  

  const changeMark = (index) => {
    /*
    console.log("Start\nMarks")
    console.log(marks)
    console.log("right field groups")
    console.log(rightFieldGroups)*/

    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups; 
    setMarks(updatedMarks); 
    
    setActiveMark(index); 
    setRightFieldGroups(marks[index]);

    /*
    console.log("End\nMarks")
    console.log(marks)
    console.log("right field groups")
    console.log(rightFieldGroups)*/
  };

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      changeMark(marks.length - 1);
      setButtonClicked(false); 
    }
  }, [buttonClicked, marks]);

  const generate = () => {
    const fieldData = marks.map((mark) =>
      mark.map((group) =>
        group.map((field) => [
          {
            field: field.field
          }
        ])
      )
    );
  
    const jsonData = JSON.stringify(fieldData, null, 2);
  
    // Vytvořte Blob objekt z JSON dat
    const blob = new Blob([jsonData], { type: "application/json" });
  
    // Vytvořte URL objekt pro Blob
    const url = URL.createObjectURL(blob);
  
    // Vytvořte odkaz pro stažení souboru
    const a = document.createElement("a");
    a.href = url;
    a.download = "fields.json";
    a.click();
  
    // Uvolnění URL objektu
    URL.revokeObjectURL(url);
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
                  height: 'calc(100vh - 20px)',
                  overflowY: "scroll",
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
              width: '60%',
              minHeight: "calc(100vh - 20px)",
              background: 'red',
              padding: 10,
              display: 'flex',
              flexDirection: "column",
              gap: '10px'
            }}
          >
            {rightFieldGroups.map((group, groupIndex) => (
              <Droppable key={`group-${groupIndex}`} droppableId={`group-${groupIndex}`} direction='horizontal'>
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
                    {group.map((field, index) => (
                      <Draggable key={field.field} draggableId={field.field} index={index}>
                        {(provided) => (
                          <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: 'flex',
                          flex: '1',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
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
            ))}
            <button onClick={addNewFieldGroup}>Pridať riadok</button>
          </div>
          <div 
          style={{
            backgroundColor: "yellow",
            width: "20%",
            minHeight: "calc(100vh - 20px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            
          }}>
            <div>
            {marks.map((mark,i) => {
              let active = activeMark===i ? "bold" : "normal";
              let border = activeMark===i ? "3px solid black" : "1px solid black";
              return(
                <div                 
                  style={{
                    textAlign: "center",
                    borderBottom: border,
                    width: "60%",
                    margin: "auto",
                    display:"flex",
                    justifyContent: "space-between",
                    padding: "0 10px"
                  }}  
                >
                  <h3
                    style={{
                      cursor: "pointer",  
                      fontWeight: active,
                      margin: "20px 0 5px 0"
                    }}
                    onClick={() => changeMark(i)}
                  >Záložka {i+1}</h3>
                  <h3
                  style={{
                    cursor: "pointer",  
                    fontWeight: active,
                    margin: "20px 0 5px 0"
                  }}
                  onClick={() => deleteMark(i)}
                  >
                    X
                  </h3>
                </div>
              )
            })}
            <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px"
            }}>
            <button onClick={() => {
              setMarks(prevMarks => [...prevMarks, []])
              setButtonClicked(true)              
            }}>
              Pridať záložku
            </button>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <button onClick={generate}
              style={{
                margin: "0 0 20px 0"
              }}
            >
              GENEROVAŤ
            </button>
          </div>
          </div>
        </div>
      </DragDropContext>
      
    </div>
  );
}

export default App;
