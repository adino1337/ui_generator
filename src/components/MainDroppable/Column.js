import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Settings } from "lucide-react";

function SettingsBox(props) {
  const [openClassMenu, setOpenClassMenu] = useState(false);


  let border =
    props.theme === "dark"
      ? `3px solid ${props.themeStyles.secondary}`
      : "3px solid black";

  return (
    <div className="settings">
      <Settings
        className="icon"
        size={18}
        color={props.theme === "dark" ? props.themeStyles.secondary : "black"}
        onClick={() => setOpenClassMenu((prev) => !prev)}
      />
      {openClassMenu && (
        <>
          <div
            className="stvorec"
            style={{
              background:
                props.theme === "dark" ? props.themeStyles.secondary : "black",
            }}
          ></div>

          <div className="radioButtons" style={{ border: border }}>
            <h4>Šírka</h4>
            <div className="inputBox">
              <label for="detail-small">malá (15%)</label>
              <input
                type="radio"
                name="className"
                value="detail-small"
                id="detail-small"
              />
            </div>
            <div className="inputBox">
              <label for="detail-large">veľká (85%)</label>
              <input
                type="radio"
                name="className"
                value="detail-large"
                id="detail-large"
              />
            </div>

            <div className="inputBox">
              <label for="auto">auto</label>
              <input
                type="radio"
                name="className"
                value="auto"
                id="auto"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Column(props) {
    const [width,setWidth] = useState("auto")
  return (
    <Droppable
      key={`group-${props.rowIndex}`}
      droppableId={`group-${props.rowIndex}`}
      direction="horizontal"
      type="column"
    >
      {(providedRow, snapshotRow) => {
        let columnMaxWidth = props.edit ? "none" : "120px";

        return (
          <div
            ref={providedRow.innerRef}
            className="group"
            {...providedRow.droppableProps}
            style={{width: width}}
          >
            {props.row.map((column, columnIndex) => (
              <Draggable
                key={`column-${props.rowIndex}-${columnIndex}-grab`}
                draggableId={`column-${props.rowIndex}-${columnIndex}-grab`}
                index={columnIndex}
                type="column"
                isDragDisabled={!props.edit}
              >
                {(providedField, snapshot) => {
                  let styles = {
                    ...providedField.draggableProps.style,
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
                      {props.row.length === 2 && !props.edit && (
                        <SettingsBox
                          theme={props.theme}
                          themeStyles={props.themeStyles}
                        />
                      )}

                      <Droppable
                        key={`column-${props.rowIndex}-${columnIndex}`}
                        droppableId={`column-${props.rowIndex}-${columnIndex}`}
                        direction="vertical"
                        type="field"
                      >
                        {(providedCol, snapshot) => {
                          let styles = snapshot.isDraggingOver
                            ? {
                                background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
                                backgroundSize: "20px 20px",
                              }
                            : {};
                          return (
                            <div
                              ref={providedCol.innerRef}
                              className="column-droppable"
                              {...providedCol.droppableProps}
                              style={styles}
                            >
                              {column.map((field, fieldIndex) => {
                                let styles =
                                  field.type === "title"
                                    ? {
                                        border: "2px solid #101010",
                                      }
                                    : {};
                                return (
                                  <Draggable
                                    key={field.field}
                                    draggableId={field.field}
                                    index={fieldIndex}
                                    type="field"
                                    isDragDisabled={!props.edit}
                                  >
                                    {(providedField, snapshot) => (
                                      <div
                                        className="field"
                                        ref={providedField.innerRef}
                                        {...providedField.draggableProps}
                                        {...providedField.dragHandleProps}
                                        style={{
                                          ...styles,
                                          ...providedField.draggableProps.style,
                                        }}
                                      >
                                        {props.edit && (
                                          <div
                                            className="delete"
                                            onClick={() => {
                                              field.type === "title"
                                                ? props.deleteField(
                                                    props.rowIndex,
                                                    columnIndex,
                                                    fieldIndex,
                                                    "title"
                                                  )
                                                : props.deleteField(
                                                    props.rowIndex,
                                                    columnIndex,
                                                    fieldIndex,
                                                    "UIBlock"
                                                  );
                                            }}
                                          >
                                            X
                                          </div>
                                        )}
                                        <div>{field.title}</div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {providedCol.placeholder}
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
                key={`addColumn-${props.rowIndex}`}
                droppableId={`addColumn-${props.rowIndex}`}
                direction="vertical"
                type="field"
              >
                {(provided, snapshot) => {
                  let styles = snapshot.isDraggingOver
                    ? {
                        background: `linear-gradient(-45deg, ${props.themeStyles.bgSvetlejsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgSvetlejsia} 50%, ${props.themeStyles.bgSvetlejsia} 75%, transparent 75%, transparent)`,
                        backgroundSize: "20px 20px",
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
  );
}
