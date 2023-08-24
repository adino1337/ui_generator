import { useState } from "react";

export default function Sidebar(props) {
  const [sidePanel, setSidePanel] = useState(true);

  return (
    <div
      className="side-panel"
      style={{
        width: sidePanel ? "15%" : "75px",
        backgroundColor: props.bgColor,
      }}
    >
      {sidePanel ? (
        <>
          <h1 className="close-panel-icon" onClick={() => setSidePanel(false)}>
            {"<"}
          </h1>
          <h4 className="side-panel-title">{props.title}</h4>
          {props.children}
          <div className="side-panel-bg"
            style={{backgroundColor: props.nextBgColor}}
          ></div>
        </>
      ) : (
        <>
        <h1 style={{textOrientation: "sideways", writingMode: "vertical-lr", display: "flex", flex: "1", alignItems: "center", justifyContent: "center"}}>{props.title}</h1>
        <h1 className="open-panel-icon" onClick={() => setSidePanel(true)}>
          {">"}
        </h1>
        <div className="side-panel-bg"
            style={{backgroundColor: props.nextBgColor}}
          ></div>
        </>
      )}
    </div>
  );
}
