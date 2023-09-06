import "./EditButtons.css"
export default function EditButtons(props){
    return(
        <div className="info">
              <div className="text">
                <h1>
                  {props.markName}
                </h1>
                <p>
                  Vyskladajte si vlastnú schému pomocou UI blokov, vlastných
                  nadpisov a ďalších komponentov
                </p>
              </div>

              <div className="buttons">
                <button onClick={props.generate} style={{ fontWeight: "bold" }}>
                  GENEROVAŤ
                </button>
                <button onClick={() => props.setEdit((prev) => !prev)}>
                  {props.edit ? "Náhľad" : "Upraviť"}
                </button>
              </div>
            </div>
    )
}