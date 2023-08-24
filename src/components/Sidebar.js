import { useState} from "react";

export default function Sidebar(props){
    const [sidePanel, setSidePanel] = useState(true)

    return(
        <div
        className="side-panel"
            style={{
              width: sidePanel ? "15%" : "75px",
            }}
          >

          {
            sidePanel ?
            <>
            <h1
               className="close-panel-icon"
              onClick={()=>setSidePanel(false)}
            >{'<'}
              </h1>
              {props.children  } 
            </>
            
            :
            <h1
                className="open-panel-icon"
              onClick={()=>setSidePanel(true)}
            >{'>'}</h1> 
            }
          </div>
    )
}