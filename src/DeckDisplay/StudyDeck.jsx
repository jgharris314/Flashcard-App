import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { readDeck, listCards } from "../utils/api";

export default function StudyDeck({ cards, setCards }) {
  const { deckId } = useParams();
  const [flipped, setFlipped] = useState(false);
  const [count, setCount] = useState(0);
  const [tempDeck, setTempDeck] = useState({});
  const history = useHistory();

  useEffect(() => {
    const aborter = new AbortController();
    setCards([]);
    setTempDeck({});
    const getDeck = async () => {
      const response = await readDeck(deckId, aborter.signal);
      setTempDeck(() => ({ ...tempDeck, ...response }));
    };

    getDeck();

    return () => {
      aborter.abort();
    };
  }, [deckId, readDeck, listCards]);

  setCards(tempDeck.cards);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (count + 1 < cards.length) {
      setCount(count + 1);
      setFlipped(false);
    } else {
      const result = window.confirm("Do you wish to restart?");
      if (result) {
        setCount(0);
      } else {
        history.push("/");
      }
    }
  };

  const studySection = (() => {
    if (!cards) {
      return <div>Loading...</div>;
    } else if (cards.length >= 3) {
      return (
        <div>
          <h2>{`Card ${count + 1} of ${cards.length}`}</h2>
          {flipped ? (
            <div className="container">
              <div className="row">{cards[count].back}</div>
              <div className="row">
                <button className="btn btn-secondary mx-1" onClick={handleFlip}>
                  Flip
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="row">{cards[count].front} </div>
              <button className="btn btn-secondary mx-1" onClick={handleFlip}>
                Flip
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <h2>Not enough cards.</h2>
          <p>
            You need at least 3 cards to study. There are {cards.length} cards
            in this deck.
          </p>
          <Link className="btn btn-primary" to={`/decks/${deckId}/cards/new`}>
            Add Cards
          </Link>
        </div>
      );
    }
  })();

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${tempDeck.id}`}>{tempDeck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Study</li>
        </ol>
      </nav>
      <h1>{tempDeck.name}: Study</h1>
      {cards && tempDeck ? studySection : null}
    </React.Fragment>
  );
}
