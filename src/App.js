import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import "./index.css";
import schema from "./schemas/schema_3.json";
import Sidebar from "./components/Sidebar";
import getThemeStyles from "./assets/themes";
import { X, PenLine } from 'lucide-react';

function App() {
  const initialFields = schema;

  const [leftFields, setLeftFields] = useState(initialFields);
  const [titleField, setTitleField] = useState([]);
  const [marks, setMarks] = useState([[]]);
  const [markNames, setMarkNames] = useState(["Formulár"])
  const [activeMark, setActiveMark] = useState(0);
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
  const [edit, setEdit] = useState(true);
  const [type, setType] = useState("field");
  const [titleText, setTitleText] = useState("");
  const [dragEnd, setDragEnd] = useState(false);

  useEffect(() => {
    setRightFieldGroups((prev) => {
      return prev.map((row) => {
        return row.filter((col) => col.length !== 0);
      });
    });
    setRightFieldGroups((prev) => {
      return prev.filter((row) => row.length !== 0);
    });
  }, [dragEnd]);

  const onDragEnd = (result) => {
    setDragEnd((prev) => !prev);
    if (!result.destination) return;

    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;

    if (sourceList === "left-list" && destinationList === "addRow") {
      const [movedField] = leftFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    } else if (sourceList === "title-list" && destinationList === "addRow") {
      const [movedField] = titleField.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    } else if (
      sourceList.split("-")[0] === "column" &&
      destinationList === "addRow"
    ) {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      const [movedField] = sourceFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    }
    if (sourceList === "title-list" && destinationList === "left-list") return;
    if (sourceList === "left-list" && destinationList === "title-list") return;

    if (sourceList === destinationList) {
      if (sourceList.split("-")[0] === "column") {
        let rowNumber = sourceList.split("-")[1];
        let columnNumber = sourceList.split("-")[2];
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
      } else if (sourceList === "title-list") {
        const sourceFields = titleField;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setTitleField([...sourceFields]);
      } else if (sourceList.split("-")[0] === "group") {
        let rowNumber = sourceList.split("-")[1];
        const sourceFields = rightFieldGroups[rowNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      } else if (sourceList === "base") {
        const sourceFields = rightFieldGroups;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      }
    } else if (
      destinationList !== "left-list" &&
      destinationList !== "title-list"
    ) {
      // Presun z ľavého zoznamu do pravého
      if (sourceList === "left-list") {
        const [movedField] = leftFields.splice(result.source.index, 1);
        if (destinationList.split("-")[0] === "addColumn") {
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
      } else if (sourceList === "title-list") {
        const [movedField] = titleField.splice(result.source.index, 1);
        if (destinationList.split("-")[0] === "addColumn") {
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
        if (
          sourceList.split("-")[0] === "group" &&
          destinationList.split("-")[0] === "group"
        ) {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          let destinationRowNumber = parseInt(destinationList.split("-")[1]);

          const sourceFields = rightFieldGroups[sourceRowNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          rightFieldGroups[destinationRowNumber].splice(
            result.destination.index,
            0,
            movedField
          );
        } else if (destinationList === "addRowWithColumn") {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          const sourceFields = rightFieldGroups[sourceRowNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          setRightFieldGroups((prev) => [...prev, [movedField]]);
          return;
        } else {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          let sourceColumnNumber = parseInt(sourceList.split("-")[2]);
          const sourceFields =
            rightFieldGroups[sourceRowNumber][sourceColumnNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          if (destinationList.split("-")[0] === "addColumn") {
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
      }
    } else if (sourceList !== "left-list" && destinationList === "left-list") {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      if (sourceFields[result.source.index].type === "title") return;
      const [movedField] = sourceFields.splice(result.source.index, 1);
      leftFields.splice(result.destination.index, 0, movedField);
    } else if (
      sourceList !== "title-list" &&
      destinationList === "title-list"
    ) {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      if (sourceFields[result.source.index].type !== "title") return;
      const [movedField] = sourceFields.splice(result.source.index, 1);
      titleField.splice(result.destination.index, 0, movedField);
    }
  };

  const deleteField = (rowIndex, columnIndex, fieldIndex, fieldType) => {
    const movedField = rightFieldGroups[rowIndex][columnIndex][fieldIndex];
    setRightFieldGroups((prev) => {
      return prev.map((row, rowID) => {
        if (rowID !== rowIndex) return row;

        return row.map((column, colID) => {
          if (colID !== columnIndex) return column;
          return column.filter((field, fieldID) => fieldID !== fieldIndex);
        });
      });
    });
    if (fieldType === "title") setTitleField((prev) => [movedField, ...prev]);
    else setLeftFields((prev) => [movedField, ...prev]);
  };

  const [theme, setTheme] = useState("");
  const [themeStyles, setThemeStyles] = useState({});

  useEffect(() => {
    if (localStorage.getItem("theme")) setTheme(localStorage.getItem("theme"));
    else setTheme("light");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    setThemeStyles(getThemeStyles(theme));
  }, [theme]);

  useEffect(() => {
    document
      .querySelector(":root")
      .style.setProperty("--bgSvetlejsia", themeStyles.bgSvetlejsia);
      document
        .querySelector(":root")
        .style.setProperty("--field", themeStyles.field);
    document
      .querySelector(":root")
      .style.setProperty("--bgTmavsia", themeStyles.bgTmavsia);
      document
        .querySelector(":root")
        .style.setProperty("--secondary", themeStyles.secondary);
        
      document
      .querySelector(":root")
      .style.setProperty("--textSecondary", themeStyles.textSecondary);
      
      document
        .querySelector(":root")
        .style.setProperty("--textPrimary", themeStyles.textPrimary);
  }, [themeStyles]);

  const generate = () => {
    let fieldData = marks.map((mark) =>
      mark.map((group) =>
        group.map((row) =>
          row.map((col) => {
            if (col.type === "title")
              return {
                title: col.title,
              };
            else if (col.type === "line")
              return {
                customComponent: "Line",
              };
            else
              return {
                field: col.field,
              };
          })
        )
      )
    );

    
    fieldData = fieldData.map((mark, i) => {
      return [{markName: markNames[i]}, ...mark]
    })

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
  
  useEffect(() => {
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups;
    setMarks(updatedMarks);
  }, [rightFieldGroups]);

  const deleteMark = (index) => { 
    setMarkNames(prev => prev.filter((name, id) => id !== index))  
      setMarks(prev => {
        if(index===activeMark){
          setActiveMark(0);
          setRightFieldGroups(marks[0])
        }else if(index < activeMark){     
          setRightFieldGroups(marks[activeMark]) 
          setActiveMark(prev => prev-1);
        }
        return prev.filter((mark, markID) => markID!==index)
      });
      
  };

  const changeMark = (index) => {
    setActiveMark(index);
    setRightFieldGroups(marks[index]);
  };

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      changeMark(marks.length - 1);
      setButtonClicked(false);
    }
  }, [buttonClicked, marks]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="app">
          <Sidebar
            edit={true}
            title="Záložky"
            bgColor={themeStyles.bgTmavsia}
            nextBgColor={
              edit ? themeStyles.bgSvetlejsia : themeStyles.bgTmavsia
            }
            theme={theme}
          >
            <div className="marks">{/*
              <button onClick={() => setTheme("dark")}>dark Theme</button>
          <button onClick={() => setTheme("light")}>light Theme</button>*/}
              {marks.map((mark, i) => {
                let active = activeMark === i ? "bold" : "normal";
                let border =
                  activeMark === i ? `3px solid ${themeStyles.field}` : theme==="dark" ? `3px solid ${themeStyles.textPrimary}` : "3px solid black";
                return (
                  <div className="mark">
                  <div
                    className="markText"
                    style={{
                      borderLeft: border,
                    }}
                    onClick={() => {
                        changeMark(i)
                    }}
                  >
                    <h3
                      style={{
                        cursor: "pointer",
                        fontWeight: active,
                        margin: "5px 0",
                        color: activeMark === i ? `${themeStyles.field}` : theme==="dark" ? `${themeStyles.textPrimary}`: "black"
                      }}
                    >
                      {markNames[i]}
                    </h3>
                    
                  </div>
                  {
                    edit && i!==0 &&
                    <div
                    className="icons">
                    <X
                      size={18}
                      onClick={()=>deleteMark(i)}
                    />
                    <PenLine 
                    size={22}
                    onClick={()=>console.log(i)}
                    />
                    </div>
                  }
                  </div>
                );
              })}
              {edit &&
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => {
                    setMarks((prevMarks) => [...prevMarks, []]);
                    setMarkNames((prevNames) => [...prevNames, `Záložka ${prevNames.length}`]);
                    setButtonClicked(true);
                  }}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                    width: "35px",
                    height:"35px",
                    borderRadius:"50%",
                    backgroundColor: `${themeStyles.field}`,
                    color: `${themeStyles.textPrimary}`,
                    fontSize: "24px"
                  }}
                >
                  +
                </button>
              </div>}
            </div>
          </Sidebar>

          <Sidebar
            edit={edit}
            title="UI bloky"
            bgColor={themeStyles.bgSvetlejsia}
            nextBgColor={themeStyles.bgTmavsia}
            theme={theme}
          >
            <Droppable droppableId="left-list" type="field">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="left-panel"
                  {...provided.droppableProps}
                >
                  {leftFields.map((field, index) => {
                    if (field.type !== "title")
                      return (
                        <Draggable
                          key={field.field}
                          draggableId={field.field}
                          index={index}
                          type="field"
                          isDragDisabled={!edit}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="field"
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              {field.title}
                            </div>
                          )}
                        </Draggable>
                      );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Sidebar>

          <Sidebar
            edit={edit}
            title="Nadpisy"
            bgColor={themeStyles.bgTmavsia}
            nextBgColor={themeStyles.bgTmavsia}
            theme={theme}
          >
            <form
              className="titleInputBox"
              onSubmit={(e) => {
                e.preventDefault();
                if (titleText.length) {
                  setTitleField((prev) => [
                    {
                      type: "title",
                      title: "Nadpis: " + titleText,
                      field: titleText + "-" + Date.now(),
                    },
                    ...prev,
                  ]);
                  setTitleText("");
                }
              }}
            >
              <input
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="Nadpis"
                style={{color: theme==="light" && "black"}}
              />
              <button>Pridať Nadpis</button>
            </form>
            <Droppable droppableId="title-list" type="field">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="left-panel"
                  style={{ marginTop: "10px" }}
                  {...provided.droppableProps}
                >
                  {titleField.map((field, index) => {
                    return (
                      <Draggable
                        key={field.field}
                        draggableId={field.field}
                        index={index}
                        type="field"
                        isDragDisabled={!edit}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="field"
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            {field.title}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Sidebar>

          <div className="right-panel-wrapper">
            <div className="info">
              <div className="text">
                <h4 style={{color: theme==="light" && "black"}}>Vytvorte UI schému</h4>
                <p>
                  Vyskladajte si vlastnú schému pomocou UI blokov, vlastných
                  nadpisov a ďalších komponentov
                </p>
              </div>

              <div className="buttons">
                <button onClick={generate} style={{ fontWeight: "bold" }}>
                  GENEROVAŤ
                </button>
                <button onClick={() => setEdit((prev) => !prev)}>
                  {edit ? "Náhľad" : "Upraviť"}
                </button>
              </div>
            </div>
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
                    className="right-panel"
                    {...providedBase.droppableProps}
                  >
                    <Sidebar
                      orientation="horizontal"
                      title="Ďalšie komponenty"
                      bgColor={themeStyles.bgTmavsia}
                      nextBgColor={themeStyles.bgSvetlejsia}
                      edit={edit}
                      theme={theme}
                    >
                      <button
                        onClick={() => {
                          setRightFieldGroups((prev) => {
                            return [...prev, [[{ type: "line" }]]];
                          });
                        }}
                      >
                        Čiara
                      </button>
                    </Sidebar>

                    {rightFieldGroups.map((row, rowIndex) => (
                      <Draggable
                        key={`row-${rowIndex}-grab`}
                        draggableId={`row-${rowIndex}-grab`}
                        index={rowIndex}
                        type="row"
                        isDragDisabled={!edit}
                      >
                        {(providedField, snapshot) => {
                          let typeOfComponent;
                          try {
                            typeOfComponent = row[0][0].type;

                            if (typeOfComponent === "line")
                              return (
                                <div
                                  ref={providedField.innerRef}
                                  {...providedField.draggableProps}
                                  {...providedField.dragHandleProps}
                                  style={{
                                    padding: "20px 0",
                                    display: "flex",
                                    ...providedField.draggableProps.style,
                                  }}
                                  onClick={() => {
                                    if (edit)
                                      setRightFieldGroups((prev) =>
                                        prev.filter(
                                          (row, rowID) => rowID !== rowIndex
                                        )
                                      );
                                  }}
                                >
                                  <div className="line"></div>
                                </div>
                              );
                            return (
                              <div
                                ref={providedField.innerRef}
                                {...providedField.draggableProps}
                                {...providedField.dragHandleProps}
                                style={{
                                  ...providedField.draggableProps.style,
                                }}
                                className="row"
                              >
                                <Droppable
                                  key={`group-${rowIndex}`}
                                  droppableId={`group-${rowIndex}`}
                                  direction="horizontal"
                                  type="column"
                                >
                                  {(providedRow, snapshotRow) => {
                                    let columnMaxWidth = edit
                                      ? "none"
                                      : "120px";

                                    return (
                                      <div
                                        ref={providedRow.innerRef}
                                        className="group"
                                        {...providedRow.droppableProps}
                                      >
                                        {row.map((column, columnIndex) => (
                                          <Draggable
                                            key={`column-${rowIndex}-${columnIndex}-grab`}
                                            draggableId={`column-${rowIndex}-${columnIndex}-grab`}
                                            index={columnIndex}
                                            type="column"
                                            isDragDisabled={!edit}
                                          >
                                            {(providedField, snapshot) => {
                                              let styles = {
                                                ...providedField.draggableProps
                                                  .style,
                                              };
                                              styles = edit
                                                ? {
                                                    ...styles,
                                                    maxWidth: "200px",
                                                  }
                                                : {
                                                    ...styles,
                                                    minWidth: "0",
                                                  };

                                              return (
                                                <div
                                                  ref={providedField.innerRef}
                                                  {...providedField.draggableProps}
                                                  {...providedField.dragHandleProps}
                                                  style={styles}
                                                  className="column"
                                                >
                                                  <Droppable
                                                    key={`column-${rowIndex}-${columnIndex}`}
                                                    droppableId={`column-${rowIndex}-${columnIndex}`}
                                                    direction="vertical"
                                                    type="field"
                                                  >
                                                    {(
                                                      providedCol,
                                                      snapshot
                                                    ) => {
                                                      let styles =
                                                        snapshot.isDraggingOver
                                                          ? {
                                                              background: `linear-gradient(-45deg, ${themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${themeStyles.bgTmavsia} 50%, ${themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
                                                              backgroundSize:
                                                                "20px 20px",
                                                            }
                                                          : {};
                                                      return (
                                                        <div
                                                          ref={
                                                            providedCol.innerRef
                                                          }
                                                          className="column-droppable"
                                                          {...providedCol.droppableProps}
                                                          style={styles}
                                                        >
                                                          {column.map(
                                                            (
                                                              field,
                                                              fieldIndex
                                                            ) => {
                                                              let styles =
                                                                field.type ===
                                                                "title"
                                                                  ? {
                                                                      border:
                                                                        "2px solid #101010",
                                                                    }
                                                                  : {};
                                                              return (
                                                                <Draggable
                                                                  key={
                                                                    field.field
                                                                  }
                                                                  draggableId={
                                                                    field.field
                                                                  }
                                                                  index={
                                                                    fieldIndex
                                                                  }
                                                                  type="field"
                                                                  isDragDisabled={
                                                                    !edit
                                                                  }
                                                                >
                                                                  {(
                                                                    providedField,
                                                                    snapshot
                                                                  ) => (
                                                                    <div
                                                                      className="field"
                                                                      ref={
                                                                        providedField.innerRef
                                                                      }
                                                                      {...providedField.draggableProps}
                                                                      {...providedField.dragHandleProps}
                                                                      style={{
                                                                        ...styles,
                                                                        ...providedField
                                                                          .draggableProps
                                                                          .style,
                                                                      }}
                                                                    >
                                                                      {edit && (
                                                                        <div
                                                                          className="delete"
                                                                          onClick={() => {
                                                                            field.type ===
                                                                            "title"
                                                                              ? deleteField(
                                                                                  rowIndex,
                                                                                  columnIndex,
                                                                                  fieldIndex,
                                                                                  "title"
                                                                                )
                                                                              : deleteField(
                                                                                  rowIndex,
                                                                                  columnIndex,
                                                                                  fieldIndex,
                                                                                  "UIBlock"
                                                                                );
                                                                          }}
                                                                        >
                                                                          X
                                                                        </div>
                                                                      )}
                                                                      <div>
                                                                        {
                                                                          field.title
                                                                        }
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                </Draggable>
                                                              );
                                                            }
                                                          )}
                                                          {
                                                            providedCol.placeholder
                                                          }
                                                        </div>
                                                      );
                                                    }}
                                                  </Droppable>
                                                </div>
                                              );
                                            }}
                                          </Draggable>
                                        ))}
                                        {providedRow.placeholder}
                                        {edit && (
                                          <Droppable
                                            key={`addColumn-${rowIndex}`}
                                            droppableId={`addColumn-${rowIndex}`}
                                            direction="vertical"
                                            type="field"
                                          >
                                            {(provided, snapshot) => {
                                              let styles =
                                                snapshot.isDraggingOver
                                                  ? {
                                                      background: `linear-gradient(-45deg, ${themeStyles.bgSvetlejsia} 25%, transparent 25%, transparent 50%, ${themeStyles.bgSvetlejsia} 50%, ${themeStyles.bgSvetlejsia} 75%, transparent 75%, transparent)`,
                                                      backgroundSize:
                                                        "20px 20px",
                                                    }
                                                  : {};
                                              return (
                                                <div
                                                  ref={provided.innerRef}
                                                  className="plusCol"
                                                  style={{
                                                    ...styles,
                                                    maxWidth: columnMaxWidth,
                                                  }}
                                                  {...provided.droppableProps}
                                                >
                                                  +
                                                </div>
                                              );
                                            }}
                                          </Droppable>
                                        )}
                                      </div>
                                    );
                                  }}
                                </Droppable>
                              </div>
                            );
                          } catch (e) {
                            console.error("ERROR: " + e);
                          }
                        }}
                      </Draggable>
                    ))}
                    {providedBase.placeholder}

                    {edit && (
                      <Droppable
                        key={`addRow`}
                        droppableId={`addRow`}
                        direction="vertical"
                        type={type}
                      >
                        {(provided, snapshot) => {
                          let styles = snapshot.isDraggingOver
                            ? {
                                background: `linear-gradient(-45deg, ${themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${themeStyles.bgTmavsia} 50%, ${themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
                                backgroundSize: "20px 20px",
                              }
                            : {};
                          return (
                            <div
                              ref={provided.innerRef}
                              className="plusRow"
                              {...provided.droppableProps}
                              style={styles}
                            >
                              <Droppable
                                key={`addRowWithColumn`}
                                droppableId={`addRowWithColumn`}
                                direction="vertical"
                                type={"column"}
                              >
                                {(provided, snapshot) => {
                                  let styles = snapshot.isDraggingOver
                                    ? {
                                        background: `linear-gradient(-45deg, ${themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${themeStyles.bgTmavsia} 50%, ${themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
                                        backgroundSize: "20px 20px",
                                      }
                                    : {};
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      className="plusRowWithColumn"
                                      {...provided.droppableProps}
                                      style={styles}
                                    >
                                      {rightFieldGroups.length === 0 ? (
                                        <div className="text">
                                          <h2 style={{color: theme==="light" && "black"}}>UI SCHÉMA</h2>
                                          <p>
                                            pretiahnite a pustite daný blok
                                          </p>
                                          <h4>+</h4>
                                        </div>
                                      ) : (
                                        <div>
                                          +
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Droppable>
                            </div>
                          );
                        }}
                      </Droppable>
                    )}
                  </div>
                );
              }}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
