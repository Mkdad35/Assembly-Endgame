import {  useReducer } from 'react'
import './App.css'
import { type Language, languages } from './LanguagesArray'
import { wordsBank } from './WordBank'
import type {JSX} from 'react'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

interface State {
  currentWord: string;
  guessedWord: string[];
}

type Action = {
  type: 'GUESS_LETTER';
  payload: string;
} | {
  type: 'NEW_GAME'
}

const INITIAL_STATE : State = {
  currentWord: wordsBank[Math.floor(Math.random() * wordsBank.length)],
  guessedWord: [],
};


function gameReducer(state : State, action : Action) : State {
  switch (action.type) {
    case 'GUESS_LETTER': {
      const letter = action.payload;
      if (state.guessedWord.includes(letter)) return state;

      return {
        ...state,
        guessedWord: [...state.guessedWord, letter] 
      };
    }
    
    case 'NEW_GAME': {
      return {
        currentWord: wordsBank[Math.floor(Math.random() * wordsBank.length)],
        guessedWord: []
      };
    }
    
    default:
      return state;
  }
}



function App() : JSX.Element {

  //States
  /*
  const [currentWord, setCurrentWord] = useState(() => wordsBank[Math.floor(Math.random() * wordsBank.length)])
  const [guessedWord, setGuessedWord] = useState([])
  const [currentLanguage, setCurrentLanguage] = useState(languages[0].name)
  const wrongGuess = guessedWord.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split('').every(letter => guessedWord.includes(letter));
  const isGameLost = (wrongGuess === languages.length - 1)
  const isGameOver = isGameWon || isGameLost*/

  const [state, dispatch] : [State, React.Dispatch<Action>] = useReducer(gameReducer, INITIAL_STATE);
  const { currentWord, guessedWord } = state;

  // Deriving variables stays identical, reading directly from the reducer state
  const wrongGuess : number = guessedWord.filter(letter => !currentWord.includes(letter)).length
  const isGameWon : boolean = currentWord.split('').every(letter => guessedWord.includes(letter));
  const isGameLost : boolean = (wrongGuess === languages.length - 1)
  const isGameOver : boolean = isGameWon || isGameLost

  function startNewGame() : void {
    dispatch({ type: 'NEW_GAME' });
  }

  function handleBtnClicked(e: React.MouseEvent<HTMLButtonElement>) : void {
    const target = e.currentTarget;
    dispatch({ type: 'GUESS_LETTER', payload: target.value });
  }


  return (
    <div className='Main-container'>
      <section className='Header-section'>
        <h1>Assembly: Endgame</h1>
        <h2>Save programming languages, to save developers from using <span style={{color: '#ec5d5d'}}>ASSEMBLY</span> to write every code!.</h2>
      </section>
      <section className={`Game-status-section ${isGameWon ? 'won' : isGameLost ? 'lost' : 'playing'}`}>
        {isGameWon && (
          <>
            <h2>You Won!</h2>
            <p>Well done! You saved the development ecosystem 🎉</p>
          </>
        )}
        {isGameLost && (
          <>
            <h2>Game over!</h2>
            <p>Assembly rules all. Better luck next time! 💀</p>
          </>
        )}
        {!isGameOver && (
          <>
            <h2>Chances Left: {languages.length - 1 - wrongGuess}</h2>
            <p>Keep guessing to keep Assembly away!</p>
          </>
        )}
      </section>
      <section className='Languages-section'>
        <div className='chip-container'>
          {languages.map((language:Language, index:number) => {
              const isDead:boolean = index < wrongGuess
              const isCurrentThreatened:boolean = index === wrongGuess && !isGameOver;
              const chipClassName:string = `chip ${isDead ? 'dead' : ''}${isCurrentThreatened ? 'shake' : ''}`
              return(
                <span
                key = {language.name}
                className = {chipClassName}
                style = {{backgroundColor: language.backgroundColor, color : language.color}}
              >
                {language.name}
              </span>
              )
            })
          }
        </div>
      </section>
      <section className='Word-section'>
        {currentWord.split('').map((letter:string, index:number) => {
          const isGuessed:boolean = guessedWord.includes(letter)
          return (
            <span
              key = {index}
              className = {`word-letter ${isGuessed ? 'reveal-letter' : ''} ${isGameOver && !isGuessed ? 'missed-letter' : ''}`}
            >{letter.toUpperCase()}</span>
          )
        })}
      </section>
      <section className= 'Keyboard-section'>
        <div className = 'keyboard-container'>
          {alphabet.split('').map((letter) => {

            const isClicked:boolean = guessedWord.includes(letter)
            const isWrong:boolean = isClicked && !currentWord.includes(letter)
            const isRight:boolean = isClicked && currentWord.includes(letter)
            const btnClassName:string = `keyboard-btn ${isWrong ? 'wrong' : ''}${isRight ? 'right' : ''}`

            return(
              <button
                key = {letter}
                className = {btnClassName}
                value = {letter}
                disabled = {isClicked || isGameOver}
                onClick = {handleBtnClicked}
              >
                {letter.toUpperCase()}
              </button>
            )
          })}
        </div>
      </section>
      <button
       type = 'button'
       className = 'new-game'
       onClick = {startNewGame}
       disabled = {!isGameOver}
       >New Game</button>
    </div>
  )

}

export default App