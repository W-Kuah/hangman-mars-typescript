import clsx from "clsx";
import type { JSX } from "react"

export default function WordLetters(props: { currentWord: string; isLost: boolean; guessedLetters: Record<string, boolean>; isGameOver: boolean; }):JSX.Element  {
    const {currentWord, isLost, guessedLetters, isGameOver} = props;
    
    return (
        <section className="word">
            {currentWord.split("").map((letter:string, idx:number) => (
                <span 
                key={idx}
                className={clsx(
                        isLost && !guessedLetters[letter] && "missed-letter"
                    )}
                >{(guessedLetters[letter] || isGameOver) && letter}</span>
            ))}
        </section>
    )
}
