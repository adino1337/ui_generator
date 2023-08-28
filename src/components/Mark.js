import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import { X, PenLine } from 'lucide-react';

export default function Mark(props){
    return(
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
    )
}