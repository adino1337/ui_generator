import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import schema from "./schemas/schema_2.json";

function App() {
  const initialFields = schema;

  const [leftFields, setLeftFields] = useState(initialFields);
  const [marks, setMarks] = useState([[[[]],[[]]]]);
  const [activeMark, setActiveMark] = useState(0);
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
  const [edit, setEdit] = useState(true);

  useEffect(() => {
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups;
    setMarks(updatedMarks);
  }, [rightFieldGroups]);

  const [dragEnd, setDragEnd] = useState(false);

  useEffect(() => {
    
    /* vymazavanie prazdnych riadkov 
    setRightFieldGroups((prev) => {
      return prev.filter((row) => row.length !== 0);
    });
    }
    */


    if (rightFieldGroups.length > 0) {
      setRightFieldGroups((prev) => {
        return prev.map((row) => {
          return row.filter(
            (col, colIndex) => col.length !== 0 || colIndex === row.length - 1
          );
        });
      });
    }
    if (rightFieldGroups.length > 0) {
      setRightFieldGroups((prev) => {
        return prev.map((row) => {
          if (row[row.length - 1].length !== 0) return [...row, []];
          return row;
        });
        
      });
      
    }
  }, [dragEnd]);

  const onDragEnd = (result) => {
    setDragEnd((prev) => !prev);
    if (!result.destination) return;

    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
    console.log(sourceList, destinationList);
    if (sourceList === "left-list" && destinationList === "base") {
      const [movedField] = leftFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    } else if (
      sourceList.split("-")[0] === "column" &&
      destinationList === "base"
    ) {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      const [movedField] = sourceFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    }

    if (sourceList === destinationList) {
      if (sourceList.split("-")[0] === "column") {
        let rowNumber = sourceList.split("-")[1];
        let columnNumber = sourceList.split("-")[2];
        console.log(`Presun vo column ${rowNumber} ${columnNumber}`);
        const sourceFields = rightFieldGroups[rowNumber][columnNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setRightFieldGroups((prev) => {
          return prev.map((row, rowIndex) => {
            if (rowIndex === rowNumber) {
              return row.map((column, columnIndex) => {
                if (columnIndex === columnNumber) return sourceFields;
                else return column;
              });
            } else {
              return row;
            }
          });
        });
      } else if (sourceList === "left-list") {
        const sourceFields = leftFields;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setLeftFields([...sourceFields]);
      }
    } else if (destinationList !== "left-list") {
      // Presun z ľavého zoznamu do pravého
      if (sourceList === "left-list") {
        const [movedField] = leftFields.splice(result.source.index, 1);
        if (destinationList.split("-")[0] === "group") {
          let rowNumber = parseInt(destinationList.split("-")[1]);
          //pridá array do arraya podľa groupnumber v rightFieldGroups
          setRightFieldGroups((prev) => {
            return prev.map((row, i) => {
              if (i === rowNumber) return [...row, [movedField]];
              else return row;
            });
          });
        } else if (destinationList.split("-")[0] === "column") {
          const rowNumber = parseInt(destinationList.split("-")[1]);
          const columnNumber = parseInt(destinationList.split("-")[2]);
          let destinationIndex = parseInt(result.destination.index);

          setRightFieldGroups((prev) => {
            return prev.map((row, rowIndex) => {
              if (rowIndex === rowNumber) {
                return row.map((column, columnIndex) => {
                  if (columnIndex === columnNumber) {
                    let updatedColumn = [...column];
                    updatedColumn.splice(destinationIndex, 0, movedField);
                    return updatedColumn;
                  } else return column;
                });
              } else {
                return row;
              }
            });
          });
        }
      } else {
        let sourceRowNumber = parseInt(sourceList.split("-")[1]);
        let sourceColumnNumber = parseInt(sourceList.split("-")[2]);
        const sourceFields =
          rightFieldGroups[sourceRowNumber][sourceColumnNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        if (destinationList.split("-")[0] === "group") {
          let destinationRowNumber = parseInt(destinationList.split("-")[1]);
          setRightFieldGroups((prev) => {
            return prev.map((row, i) => {
              if (i === destinationRowNumber) return [...row, [movedField]];
              else return row;
            });
          });
        } else if (destinationList.split("-")[0] === "column") {
          let destinationRowNumber = parseInt(destinationList.split("-")[1]);
          let destinationColNumber = parseInt(destinationList.split("-")[2]);
          let destinationIndex = parseInt(result.destination.index);
          setRightFieldGroups((prev) => {
            return prev.map((row, rowIndex) => {
              if (rowIndex === destinationRowNumber) {
                return row.map((column, columnIndex) => {
                  if (columnIndex === destinationColNumber) {
                    let updatedColumn = [...column];
                    updatedColumn.splice(destinationIndex, 0, movedField);
                    return updatedColumn;
                  } else return column;
                });
              } else {
                return row;
              }
            });
          });
        }
      }
    } else if (sourceList !== "left-list" && destinationList === "left-list") {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      const [movedField] = sourceFields.splice(result.source.index, 1);
      leftFields.splice(result.destination.index, 0, movedField);
    }
  };

  const deleteMark = (index) => {
    if (marks.length !== 1) {
      const updatedMarks = [...marks];
      updatedMarks.splice(index, 1);
      setMarks(updatedMarks);
      console.log(index);
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
          row.map((col) => ({
            field: col.field,
          }))
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
        <div
          style={{
            display: "flex",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <Droppable droppableId="left-list" type="field">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  height: "calc(100vh - 20px)",
                  width: "20%",
                  overflowY: "scroll",
                  background: "blue",
                  padding: 10,
                  gap: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                {...provided.droppableProps}
              >
                {leftFields.map((field, index) => (
                  <Draggable
                    key={field.field}
                    draggableId={field.field}
                    index={index}
                    type="field"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          padding: "10px",
                          width: "200px",
                          backgroundColor: "white",
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
          <Droppable
            key={`base`}
            droppableId={`base`}
            direction="vertical"
            type="row"
          >
            {(providedBase, snapshot) => {
              return (
                <div
                  ref={providedBase.innerRef}
                  style={{
                    width: "60%",
                    minHeight: "calc(100vh - 20px)",
                    background: "red",
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                  {...providedBase.droppableProps}
                >
                  {rightFieldGroups.map((row, rowIndex) => (
                    <Draggable
                      key={`row-${rowIndex}-grab`}
                      draggableId={`row-${rowIndex}-grab`}
                      index={rowIndex}
                      type="row"
                    >
                      {(providedField, snapshot) => (
                        <div
                          ref={providedField.innerRef}
                          {...providedField.draggableProps}
                          {...providedField.dragHandleProps}
                          style={{
                            background: "orange",
                            minHeight: "40px",
                            minWidth: "200px",
                            height: "fit-content",
                            display: "flex",
                            padding: "20px",
                            ...providedField.draggableProps.style,
                          }}
                        >
                          <Droppable
                            key={`group-${rowIndex}`}
                            droppableId={`group-${rowIndex}`}
                            direction="horizontal"
                            type="column"
                          >
                            {(providedRow, snapshot) => (
                              <div
                                ref={providedRow.innerRef}
                                style={{
                                  background: "grey",
                                  minHeight: "40px",
                                  minWidth: "200px",
                                  height: "fit-content",
                                  flex: "1",
                                  display: "flex",
                                }}
                                {...providedRow.droppableProps}
                              >
                                {row.map((column, columnIndex) => (
                                  <Draggable
                                    key={`column-${rowIndex}-${columnIndex}-grab`}
                                    draggableId={`column-${rowIndex}-${columnIndex}-grab`}
                                    index={columnIndex}
                                    type="column"
                                  >
                                    {(providedField, snapshot) => {
                                      let dragHandleProps ={...providedField.dragHandleProps}
                                      
                                      if(columnIndex === row.length - 1)
                                      dragHandleProps = {}
                                     
                                      
                                      return(
                                      <div
                                        ref={providedField.innerRef}
                                        {...providedField.draggableProps}
                                        {...dragHandleProps}
                                        style={{
                                          display: "flex",
                                          flex: "1",
                                          padding: "20px",
                                          backgroundColor: "cyan",
                                          ...providedField.draggableProps.style,
                                        }}
                                      >
                                        <Droppable
                                          key={`column-${rowIndex}-${columnIndex}`}
                                          droppableId={`column-${rowIndex}-${columnIndex}`}
                                          direction="vertical"
                                          type="field"
                                        >
                                          {(providedCol, snapshot) => {
                                            let styles = {
                                              background:
                                                snapshot.isDraggingOver
                                                  ? "pink"
                                                  : "purple",
                                              minHeight: "40px",
                                              display: "flex",
                                              flex: "1",
                                              flexDirection: "column",
                                              gap: "10px",
                                            };
                                            styles = edit
                                              ? {
                                                  ...styles,
                                                  minWidth: "0",
                                                }
                                              : { ...styles, minWidth: "0" };

                                            return (
                                              <div
                                                ref={providedCol.innerRef}
                                                style={styles}
                                                {...providedCol.droppableProps}
                                              >
                                                {column.map(
                                                  (field, fieldIndex) => (
                                                    <Draggable
                                                      key={field.field}
                                                      draggableId={field.field}
                                                      index={fieldIndex}
                                                      type="field"
                                                    >
                                                      {(
                                                        providedField,
                                                        snapshot
                                                      ) => (
                                                        <div
                                                          ref={
                                                            providedField.innerRef
                                                          }
                                                          {...providedField.draggableProps}
                                                          {...providedField.dragHandleProps}
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "center",
                                                            alignItems:
                                                              "center",
                                                            textAlign: "center",
                                                            padding: "10px",
                                                            backgroundColor:
                                                              "white",
                                                            height: "100%",
                                                            ...providedField
                                                              .draggableProps
                                                              .style,
                                                          }}
                                                        >
                                                          {field.title}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  )
                                                )}
                                                {providedCol.placeholder}
                                              </div>
                                            );
                                          }}
                                        </Droppable>
                                      </div>
                                    )}}
                                  </Draggable>
                                ))}
                                {providedRow.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              );
            }}
          </Droppable>
          <div
            style={{
              backgroundColor: "yellow",
              width: "20%",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {marks.map((mark, i) => {
                let active = activeMark === i ? "bold" : "normal";
                let border =
                  activeMark === i ? "3px solid black" : "1px solid black";
                return (
                  <div
                    style={{
                      textAlign: "center",
                      borderBottom: border,
                      width: "60%",
                      margin: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 10px",
                    }}
                  >
                    <h3
                      style={{
                        cursor: "pointer",
                        fontWeight: active,
                        margin: "20px 0 5px 0",
                      }}
                      onClick={() => changeMark(i)}
                    >
                      Záložka {i + 1}
                    </h3>
                    <h3
                      style={{
                        cursor: "pointer",
                        fontWeight: active,
                        margin: "20px 0 5px 0",
                      }}
                      onClick={() => deleteMark(i)}
                    >
                      X
                    </h3>
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <button
                  onClick={() => {
                    setMarks((prevMarks) => [...prevMarks, []]);
                    setButtonClicked(true);
                  }}
                >
                  Pridať záložku
                </button>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <button
                onClick={generate}
                style={{
                  margin: "0 0 20px 0",
                }}
              >
                GENEROVAŤ
              </button>
              <button
                onClick={() => setEdit((prev) => !prev)}
                style={{
                  margin: "0 0 20px 0",
                }}
              >
                Nahliadnuť export
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
