import React, { useEffect, useState } from "react";
import Die from "./components/Die";
import Home from './components/Home';
import Ranking from './components/Ranking';
import Instructions from './components/Instructions';
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [gameStart, setGameStart] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [tenzies, setTenzies] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [round, setRound] = useState(1);
  const [rankingArray, setRankingArray] = useState([]);
  const [sortedRankingArray, setSortedRankingArray] = useState([]);

// We look if we have something in localStorage. If we have something,
// it update the value of rankingArray.
  useEffect(() => {
    const rankingElement = JSON.parse(localStorage.getItem('Score'));
    if (rankingElement) {
      setRankingArray(rankingElement);
    }
  }, []);

// Every time the rankingArray change, it will run those lines of code
  useEffect(() => {
      //We look if rankingArray > 0. If it is, we want to sort it.
      // It will be useful for the ranking.
    if (rankingArray.length > 0) {
      const sortedArray = [...rankingArray].sort((a, b) => a - b);
      setSortedRankingArray(sortedArray);
    }
  }, [rankingArray]);


  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function startGame() {
    setGameStart(true);
  }

  function seeRanking() {
    setShowRanking(true);
  }
    //This function will allow to switch the state. 
    // The DOM will change in terms of state
  function toggle(state) {
    state(prev => !prev);
  }
// This function will allow us to save our score in localStorage.
// Every time we run this function we want to make a copy of the 
// previous score so we use ...prevArray and we add the new score.
// After this, we will save the new rankingArray in localStorage.
  function handleSave() {
    setSavingScore(true);
    setRankingArray(prevArray => [...prevArray, round]);
    localStorage.setItem('Score', JSON.stringify(rankingArray));
  }
  
//This function allow us to generate a new object
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }
  
  // This function allow us to generate new numbers
  // in newDice array. Those numbers will be use to
  // manipulate the dom.
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }
//This function will run everty time we click on roll button.
  function rollDice() {
    // If the state tenzies is false we will map over dice array.
    if (!tenzies) {
      setDice(oldDice =>
        oldDice.map(die =>
        // If isHeld === true then we dont want to change it
        // but if isHeld === false it will change the number
        // when the button will be clicked
          die.isHeld ? die : generateNewDie()
        )
      );
      setRound(round => round + 1);
      // If it's true, it's mean we win the game so we want to
      // reset tenzies state , set the round to 1 and generate
      // a array of number
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRound(1);
    }
  }

  function holdDice(id) {
    setDice(oldDice =>
// checks whether the die identifier matches the identifier passed in 
// parameter (id). If it ok, a new object is created with the same properties as the old die
// (...die), but with the isHeld property reversed (!die.isHeld). This allow us to uptade the
// the state of a die when its clicked
      oldDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {
        !showRanking && !gameStart ? 
        
        ( <Home 
        seeRanking={seeRanking} 
        startGame={startGame} />) : 
        
        ( gameStart && !showRanking ? (
          <div className="main">
            {tenzies && <Confetti />}
            <Instructions />
            <button 
                className="btn" 
                onClick={() => toggle(setGameStart)} 
                id="home-tenzies">
                    Home
            </button>
            <p className="round">
              {tenzies ? `You've won in ${round} roll ` : `Round ${round}`}
            </p>
            
            <div className="dice-container">
              {diceElements}
            </div>
            
            <button
              className="btn roll-dice"
              onClick={rollDice}
            >
              {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies && (
              <button className="ranking btn" onClick={handleSave}>
                Save score
              </button>
            )}
          </div>
        ) : (
          !gameStart && showRanking ? (
            <div className="ranking">
              {localStorage.length > 0 ? sortedRankingArray.map((score, index) => (
                <Ranking 
                    value={score} 
                    key={nanoid()} 
                    rank={index + 1}
                    localStorage={localStorage.length} />
              )): <p>You have to play to climb the rankings</p>}

              <button 
              className="btn" 
              onClick={() => toggle(setShowRanking)} 
              id="home-ranking">
                Home
              </button>
            </div>
          ) : (
            <Home />
          )
        )
      )}
    </main>
  );
}
