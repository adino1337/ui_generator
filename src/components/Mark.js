import { useState, useEffect } from "react";
import "../App.css";
import "../index.css";
import { X, PenLine } from 'lucide-react';

export default function Mark(props){
    let active = props.activeMark === props.index ? "bold" : "normal";
    let border =
      props.activeMark === props.index ? `3px solid ${props.themeStyles.field}` : props.theme==="dark" ? `3px solid ${props.themeStyles.textPrimary}` : "3px solid black";
    return(
        <div className="mark">
                  <div
                    className="markText"
                    style={{
                      borderLeft: border,
                    }}
                    onClick={() => {
                        props.changeMark(props.index)
                    }}
                  >
                    <h3
                      style={{
                        cursor: "pointer",
                        fontWeight: active,
                        margin: "5px 0",
                        color: props.activeMark === props.index ? `${props.themeStyles.field}` : props.theme==="dark" ? `${props.themeStyles.textPrimary}`: "black"
                      }}
                    >
                      {props.markNames[props.index]}
                    </h3>
                    
                  </div>
                  {
                    props.edit && props.index!==0 &&
                    <div
                    className="icons">
                    <X
                      size={18}
                      onClick={()=>props.deleteMark(props.index)}
                    />
                    <PenLine 
                    size={22}
                    onClick={()=>console.log(props.index)}
                    />
                    </div>
                  }
                  </div>
    )
}