import { useEffect, useState, type JSX } from 'react'
import './App.css'
import { facilities } from './facilities'
import { genNewWord, capitalise, cleanStr } from './utilis'
import type { Facility, Hint } from './types';
import axios from 'axios';
import clsx from 'clsx';

function App() {

  // Static Values
  const keyboard = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");


  // Initial Functions
  const resetKeyboard = (): Record<string, boolean> => {
    const newKeyboardState: Record<string, boolean> = {};
    keyboard.forEach(letter => {
      newKeyboardState[letter] = false;
    });
    return newKeyboardState;
  }
  const calculateWin = (): boolean => {
    for (let i = 0; i < currentWord.length; i++) {
      if (!guessedLetters[currentWord[i]]) return false;
    }
    return true;
  }

  // State Variables
  const [currentWord, setCurrentWord] = useState<string>(():string => genNewWord());
  const [guessedLetters, setGuessedLetters] = useState<Record<string, boolean>>(():Record<string, boolean> => resetKeyboard());
  const [currentHints, setHints] = useState<Record<string, Hint>>({
    definition: {
      str: '',
      isShown: false,
      cost: 4
    },
    example: {
      str: '',
      isShown: false,
      cost: 4
    },
  });
  const [lives, setLives] = useState<number>(facilities.length);

  // Derived Values
  const isLost: boolean = lives === 0;
  const isWon: boolean = calculateWin();
  const isGameOver: boolean = isLost || isWon
  const facilityLostIdx: number = facilities.length - (lives + 1);


  // Functions

  const addGuessedLetter = (letter:string):void => {
    if (guessedLetters[letter] === true || isGameOver) return;
    setGuessedLetters(prevLetters => ({...prevLetters, [letter]:true}));
    if (!currentWord.includes(letter)) setLives(prevLives => prevLives - 1);
  }

  
  const handleReset = async():Promise<void> => {
    setGuessedLetters(resetKeyboard());
    setLives(facilities.length)
    setCurrentWord(genNewWord());
    setHints({
      definition: {
        str: '',
        isShown: false,
        cost: 4
      },
      example: {
        str: '',
        isShown: false,
        cost: 4
      },
    });
  }

  const handleHint = (str:string):void => {
    const cost = currentHints[str].cost;
    if (lives - cost <= 0 || currentHints[str].isShown) return;
    setHints(prevHints => ({
      ...prevHints,
      [str]: {
        ...prevHints[str],
        isShown: true
      }
    }));
    setLives(prevLives => (prevLives - cost));
  }

  const fetchWordData = async (word:string):Promise<string[] | undefined> => {
    if (!word) return;
    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      )

      const data = res.data[0].meanings
      const chosenData = data[0];
      const definitions = chosenData.definitions;
      const chosenDefinition = definitions[0];

      return [chosenDefinition.definition, chosenDefinition.example]

      

    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.status === 404
          ? 'Word not found'
          : 'Error fetching definition');
        console.log(err);
      } else {
        console.error('An unknown error occurred');
        console.log(err);
      }
    }
  }


  // Elements
  const facilitiesElem:JSX.Element[] = facilities.map((facility:Facility, idx:number) => {
    const styles = {
      backgroundColor: facility.backgroundColor,
      color: facility.color
    }
    return (
      <span 
        key={facility.name} 
        className={clsx({chip:true, lost:idx < facilities.length - lives})}
        style={styles}>{facility.name}
      </span>
    )
  });

  const letterElems:JSX.Element[] = currentWord.split("").map((letter:string, idx:number) => (
    <span 
      key={idx}
      className={clsx(
            isLost && !guessedLetters[letter] && "missed-letter"
        )}
    >{(guessedLetters[letter] || isGameOver) && letter}</span>
  ));

  const  keyboardElems:JSX.Element[] = keyboard.map((letter:string) => (
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
  ));

  const hintElems:(JSX.Element | null) [] = Object.keys(currentHints).map((hintKey: string) => (
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
    </div> : null
  ));

  useEffect(() => {
    const fetchInit = async () => {
      const result = await fetchWordData(currentWord);
      let definition = '';
      let example = '';
      if (result) {
        [definition, example] = result;
      }
    
      setHints({
        definition: {
          str: cleanStr(definition, currentWord),
          isShown: false,
          cost: 4
        },
        example: {
            str: cleanStr(example, currentWord),
            isShown: false,
            cost: 4
          }
      });
    }
    fetchInit();
  },[currentWord])


  return (
    <main>
        <header>
          <h1>MARS Systems Reboot</h1>
          <p>Guess the code to restore life-support systems using the key pad. Previous codes: <b>LIZARD</b>, <b>VAULTING</b> and <b>PASSWORD</b>. You have <u>9 chances!</u> Use the hints at high cost to the facilities' integrity.</p>
        </header>
        <section 
          aria-live="polite" 
          role="status" 
          className={clsx('game-status', isWon && 'won', isLost && 'lost', (lives < 9 && !isGameOver) && 'damage')}
        >
          {isGameOver ? 
            (
              isWon ? (
                <>
                  <h2>🚀 Life-Support Rebooting 🚀</h2>
                  <p> You have saved the colony from certain doom.</p>
                </>
              ) : (
                <>
                  <h2>⚫ Life-Support Failure ⚫</h2>
                  <p> The console makes a winding down hum followed by the LED lights dimming to black.</p>
                </>
              )
            ) : (
              <p>{lives === 9 ? null : facilities[facilityLostIdx].message}</p>
            )
          }
        </section>
        
        <section className="facility-chips">
          {facilitiesElem}
        </section>
        <section className="word">
          {letterElems}
        </section>

        <section 
          className="sr-only" 
          aria-live="polite" 
          role="status"
        >
          <p>
            {}
          </p>
          <p>Current word:{currentWord.split("").map(letter => guessedLetters[letter] ? letter + "." :"blank.")}.join(" ")</p>
        </section>
        <section className="keyboard">
          {keyboardElems}
        </section>
        
        {isGameOver ? 
          <button className="new-game" onClick={handleReset}>New Game</button> 
        :
          (currentHints.definition.str !== '' && <section className="hints">
            <h2>Hints:</h2>
            <div>
              {hintElems}
            </div>
          </section>)  
        }
      </main>
  )
}

export default App
