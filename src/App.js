import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import schema from './schemas/schema_2.json'

function App() {
  const initialFields = schema

  const [leftFields, setLeftFields] = useState(initialFields);
  const [marks, setMarks] = useState([[]])
  const [activeMark, setActiveMark] = useState(0)
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
 

  useEffect(() => {
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups; 
    setMarks(updatedMarks); 
 }, [rightFieldGroups]);

 const [dragEnd, setDragEnd] = useState(false);

 useEffect(() => {
  setRightFieldGroups(prev => {
    return prev.map(row => {
      return row.filter(col => col.length !== 0)
    })
  })  
  setRightFieldGroups(prev => {
    return prev.filter(row => row.length !== 0)
  })
}, [dragEnd]);

  const onDragEnd = (result) => {

    setDragEnd(prev => !prev)
    const sourceList = result.source.droppableId;

    if (sourceList === "left-list" && !result.destination){
      const [movedField] = leftFields.splice(result.source.index, 1);
      setRightFieldGroups(prev=>[...prev, [[movedField]]])
      return 
    }
    else if (sourceList.split("-")[0] === "column" && !result.destination){      
      let rowNumber = sourceList.split("-")[1]
      let columnNumber = sourceList.split("-")[2]
      const sourceFields = rightFieldGroups[rowNumber][columnNumber]
      const [movedField] = sourceFields.splice(result.source.index, 1);
      setRightFieldGroups(prev=>[...prev, [[movedField]]])
      return
    }    
    else if(!result.destination)      
        return;
      

      const destinationList = result.destination.droppableId;

    if (sourceList === destinationList) {
      if(sourceList.split("-")[0] === "column")
      {
        let rowNumber = sourceList.split("-")[1]
        let columnNumber = sourceList.split("-")[2]
        console.log(`Presun vo column ${rowNumber} ${columnNumber}`)
        const sourceFields = rightFieldGroups[rowNumber][columnNumber]
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setRightFieldGroups(prev => {
          return prev.map((row, rowIndex) => {
            if(rowIndex === rowNumber)
            {
              return row.map((column, columnIndex) =>{
                if(columnIndex === columnNumber)
                  return sourceFields
                else
                  return column
              })
            }
            else{
              return row
            }
          })
        })
                
      }
      else if(sourceList === "left-list") {
        const sourceFields = leftFields;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setLeftFields([...sourceFields]);
      }
      
    } 
    else if(destinationList !== "left-list") 
    {
      // Presun z ľavého zoznamu do pravého
      if (sourceList === 'left-list') {        
        const [movedField] = leftFields.splice(result.source.index, 1);
        if(destinationList.split("-")[0] === 'group') {
          let rowNumber= parseInt(destinationList.split("-")[1])
          //pridá array do arraya podľa groupnumber v rightFieldGroups   
          setRightFieldGroups( prev => {
            return prev.map((row, i) => {
              if(i === rowNumber)
                return [...row, [movedField]]
              else
                return row
            })
          })  
               
        }
        else if(destinationList.split("-")[0] === 'column'){
          const rowNumber = parseInt(destinationList.split("-")[1])
          const columnNumber = parseInt(destinationList.split("-")[2])
          setRightFieldGroups(prev => {
            return prev.map((row, rowIndex) => {
              if(rowIndex === rowNumber)
              {
                return row.map((column, columnIndex) =>{
                  if(columnIndex === columnNumber)
                    return [...column, movedField]
                  else
                    return column
                })
              }
              else{
                return row
              }
            })
          })
        }
      } 
      else 
      {        
        let sourceRowNumber = parseInt(sourceList.split("-")[1])
        let sourceColumnNumber = parseInt(sourceList.split("-")[2])
        const sourceFields = rightFieldGroups[sourceRowNumber][sourceColumnNumber]
        const [movedField] = sourceFields.splice(result.source.index, 1);
        if(destinationList.split("-")[0] === "group"){
          let destinationRowNumber= parseInt(destinationList.split("-")[1])
          setRightFieldGroups( prev => {
            return prev.map((row, i) => {
              if(i === destinationRowNumber)
                return [...row, [movedField]]
              else
                return row
            })
          })
        }
        else if(destinationList.split("-")[0] === "column"){
          let destinationRowNumber= parseInt(destinationList.split("-")[1])
          let destinationColNumber= parseInt(destinationList.split("-")[2])
          setRightFieldGroups(prev => {
            return prev.map((row, rowIndex) => {
              if(rowIndex === destinationRowNumber)
              {
                return row.map((column, columnIndex) =>{
                  if(columnIndex === destinationColNumber)
                    return [...column, movedField]
                  else
                    return column
                })
              }
              else{
                return row
              }
            })
          })
        }
      }
    }
    else if(sourceList !== "left-list" && destinationList === "left-list"){
      let rowNumber = sourceList.split("-")[1]
      let columnNumber = sourceList.split("-")[2]
      const sourceFields = rightFieldGroups[rowNumber][columnNumber]
      const [movedField] = sourceFields.splice(result.source.index, 1);
      leftFields.splice(result.destination.index, 0, movedField);
          
    }
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
        group.map((row) =>
          row.map((col) =>
            (
              {
                field: col.field
              }
            )
          )          
        )
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
            {rightFieldGroups.map((row, rowIndex) => (
              <Droppable key={`group-${rowIndex}`} droppableId={`group-${rowIndex}`} direction='horizontal'>
                {(provided) => (
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
                    {row.map((column, columnIndex) => (
                      <Droppable key={`column-${rowIndex}-${columnIndex}`} droppableId={`column-${rowIndex}-${columnIndex}`} direction='vertical'>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      background: 'pink',
                      minHeight: '40px',
                      minWidth: '40px',
                      
                      display: 'flex',
                      flex: '1',
                      flexDirection: 'column',  
                      padding: 10,
                      gap: '10px'
                    }}
                    {...provided.droppableProps}
                  >
                      {column.map((field, fieldIndex) => (
                        <Draggable key={field.field} draggableId={field.field} index={fieldIndex}>
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
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
