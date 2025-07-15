import clsx from "clsx";
import type { JSX } from "react";

export default function Keyboard(props: { keyboard: string[]; guessedLetters: Record<string, boolean>; currentWord: string; addGuessedLetter: (letter: string) => void; isGameOver: boolean; }):JSX.Element  {
    const {keyboard, guessedLetters, currentWord, addGuessedLetter, isGameOver} = props;
    return (
       <section className="keyboard">
        {keyboard.map((letter:string) => (
            <button 
              className={clsx({
                correct: guessedLetters[letter] &&  currentWord.includes(letter),
                wrong: guessedLetters[letter] &&  !currentWord.includes(letter),
              })}
              key={letter} 
              onClick={() => addGuessedLetter(letter)}
              disabled={isGameOver}
              aria-disabled={guessedLetters[letter]}
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          ))}
      </section>
    )
}