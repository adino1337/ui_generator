import "./EditButtons.css"
export default function EditButtons(props){
    return(
        <div className="info">
              <div className="text">
                <h4 style={{ color: props.theme === "light" && "black" }}>
                  Vytvorte UI schému
                </h4>
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