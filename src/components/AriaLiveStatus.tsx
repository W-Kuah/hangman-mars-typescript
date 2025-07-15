import type { JSX } from "react";

type AriaLiveStatusProps = {
    currentWord: string,
    guessedLetters: Record<string, boolean>,
}

export default function AriaLiveStatus(props: AriaLiveStatusProps):JSX.Element {
    const {currentWord, guessedLetters} = props;
    return (
        <section 
          className="sr-only" 
          aria-live="polite" 
          role="status"
        >
          <p>Current word:{currentWord.split("").map((letter:string) => guessedLetters[letter] ? letter + "." :"blank.")}.join(" ")</p>
        </section>
    )
}