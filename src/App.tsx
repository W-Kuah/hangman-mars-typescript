import { useEffect, useState, } from 'react'
import './App.css'
import { facilities } from './facilities'
import { genNewWord, cleanStr } from './utilis'
import type { Hint } from './types';
import axios from 'axios';
import AriaLiveStatus from './components/AriaLiveStatus';
import WordLetters from './components/WordLetters';
import Header from './components/Header';
import FacilityChips from './components/FacilityChips';
import GameStatus from './components/GameStatus';
import Keyboard from './components/Keyboard';
import Hints from './components/Hints';

function App() {

  // Static Values
  const keyboard: string[] = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");


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
  const isGameOver: boolean = isLost || isWon;


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


  // Get Hints
  useEffect(() => {
    const fetchInit = async ():Promise<void> => {
      const result:string[] | undefined = await fetchWordData(currentWord);
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
      <Header/>
      <GameStatus
        isWon={isWon}
        isLost={isLost}
        isGameOver={isGameOver}
        lives={lives}
      />

      <FacilityChips
        lives={lives}
      />
  
      <WordLetters
        currentWord={currentWord}
        isLost={isLost}
        guessedLetters={guessedLetters}
        isGameOver={isGameOver}
      />

      <AriaLiveStatus
        currentWord={currentWord}
        guessedLetters={guessedLetters}
      />

      <Keyboard
        keyboard={keyboard}
        guessedLetters={guessedLetters}
        currentWord={currentWord}
        addGuessedLetter={addGuessedLetter}
        isGameOver={isGameOver}
      />
      
      {isGameOver ? 
        <button className="new-game" onClick={handleReset}>New Game</button> 
      :
        currentHints.definition.str !== '' && 
        <Hints
          currentHints={currentHints}
          handleHint={handleHint}
        />
      }
      </main>
  )
}

export default App
