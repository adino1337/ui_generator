import { Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "../Sidebar/Sidebar";
import "./MainDroppable.css"

export default function MainDroppable(props){
    return(
        <Droppable
              key={`base`}
              droppableId={`base`}
              direction="vertical"
              type="row"
            >
              {(providedBase) => {
                return (
                  <div
                    ref={providedBase.innerRef}
                    className="right-panel"
                    {...providedBase.droppableProps}
                  >
                    <Sidebar
                      orientation="horizontal"
                      title="Ďalšie komponenty"
                      bgColor={props.themeStyles.bgTmavsia}
                      nextBgColor={props.themeStyles.bgSvetlejsia}
                      edit={props.edit}
                      theme={props.theme}
                    >
                      <button
                        onClick={() => {
                            props.setRightFieldGroups((prev) => {
                            return [...prev, [[{ type: "line" }]]];
                          });
                        }}
                      >
                        Čiara
                      </button>
                    </Sidebar>

                    {props.rightFieldGroups.map((row, rowIndex) => (
                      <Draggable
                        key={`row-${rowIndex}-grab`}
                        draggableId={`row-${rowIndex}-grab`}
                        index={rowIndex}
                        type="row"
                        isDragDisabled={!props.edit}
                      >
                        {(providedField) => {
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
                                    if (props.edit)
                                    props.setRightFieldGroups((prev) =>
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
                                    let columnMaxWidth = props.edit
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
                                            isDragDisabled={!props.edit}
                                          >
                                            {(providedField, snapshot) => {
                                              let styles = {
                                                ...providedField.draggableProps
                                                  .style,
                                              };
                                              styles = props.edit
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
                                                              background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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
                                                                    !props.edit
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
                                                                      {props.edit && (
                                                                        <div
                                                                          className="delete"
                                                                          onClick={() => {
                                                                            field.type ===
                                                                            "title"
                                                                              ? props.deleteField(
                                                                                  rowIndex,
                                                                                  columnIndex,
                                                                                  fieldIndex,
                                                                                  "title"
                                                                                )
                                                                              : props.deleteField(
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
                                        {props.edit && (
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
                                                      background: `linear-gradient(-45deg, ${props.themeStyles.bgSvetlejsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgSvetlejsia} 50%, ${props.themeStyles.bgSvetlejsia} 75%, transparent 75%, transparent)`,
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

                    {props.edit && (
                      <Droppable
                        key={`addRow`}
                        droppableId={`addRow`}
                        direction="vertical"
                        type="field"
                      >
                        {(provided, snapshot) => {
                          let styles = snapshot.isDraggingOver
                            ? {
                                background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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
                                        background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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
                                      {props.rightFieldGroups.length === 0 ? (
                                        <div className="text">
                                          <h2
                                            style={{
                                              color:
                                              props.theme === "light" && "black",
                                            }}
                                          >
                                            UI SCHÉMA
                                          </h2>
                                          <p>pretiahnite a pustite daný blok</p>
                                          <h4>+</h4>
                                        </div>
                                      ) : (
                                        <div>+</div>
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
    )
}