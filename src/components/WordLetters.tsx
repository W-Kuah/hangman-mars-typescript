import clsx from "clsx";
import type { JSX } from "react"

type WordLettersProps = {
    currentWord: string,
    isLost: boolean,
    guessedLetters: Record<string, boolean>,
    isGameOver: boolean
}

export default function WordLetters(props: WordLettersProps):JSX.Element  {
    const {currentWord, isLost, guessedLetters, isGameOver} = props;
    
    return (
        <section className="word">
            {currentWord.split("").map((letter:string, idx:number):JSX.Element => (
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
