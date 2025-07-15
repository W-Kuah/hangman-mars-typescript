import type { JSX } from "react";
import { capitalise } from "../utilis";
import type { Hint } from "../types";


type HintsProps = {
    currentHints: Record<string, Hint>,
    handleHint: (str:string) => void; 
}
export default function Hints(props: HintsProps):JSX.Element  {
    const { currentHints, handleHint } = props;
    return (
       <section className="hints">
          <h2>Hints:</h2>
          <div>
            {Object.keys((currentHints)).map((hintKey: string):JSX.Element | null => (
                currentHints[hintKey].str !== '' ? <div key={hintKey}>
                {!currentHints[hintKey].isShown ? <button onClick={() => handleHint(hintKey)}>Show</button> : null}
                <p>
                    <b>{capitalise(hintKey)}</b>
                    {!currentHints[hintKey].isShown && (` (-${currentHints[hintKey].cost})`)}
                    : {
                    currentHints[hintKey].isShown ? 
                    currentHints[hintKey].str : '???'
                    }
                </p>
            </div> : null))}
          </div>
        </section>
    )
}