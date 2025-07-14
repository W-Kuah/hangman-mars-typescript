import { generate } from "random-words";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';


  // Profanity Matcher
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });


const genNewWord = (): string => {
    let newWord: string | string[] = generate({ minLength: 5, maxLength: 11 });
    while (typeof newWord !== 'string' || matcher.hasMatch(newWord)) {
        newWord = generate({ minLength: 5, maxLength: 11 });
    }
    return newWord.toUpperCase();
}

const capitalise = (str: string): string => {
    return String(str).charAt(0).toUpperCase() + String(val).slice(1);
}

const cleanStr = (targetStr: string, wordToRm: string): string => {
    if (typeof targetStr === 'undefined') return '';
        return targetStr.replace(wordToRm.toLowerCase(), '__').replace(capitalise(wordToRm.toLowerCase()), '__');
} 



export {genNewWord, capitalise, cleanStr}