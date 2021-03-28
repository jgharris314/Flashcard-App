import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, updateCard, readCard, readDeck } from "../utils/api";

export default function CardForm({
  setCard,
  deck,
  setDeck,
  card,
  reRender,
  setReRender,
}) {
  const { cardId, deckId } = useParams();
  const history = useHistory();

  const initialCardFormData = {
    front: "",
    back: "",
  };

  const [cardFormData, setCardFormData] = useState({ ...initialCardFormData });

  useEffect(() => {
    const aborter = new AbortController();
    setDeck({});
    setCard({});
    const getDeck = async () => {
      try {
        const response = await readDeck(deckId, aborter.signal);

        setDeck(() => ({ ...deck, ...response }));
      } catch (aFit) {
        if (aFit.name === "AbortError") {
          console.log(aFit);
        } else {
          throw aFit;
        }
      }
    };
    getDeck();

    const getCard = async () => {
      try {
        const response = await readCard(cardId, aborter.signal);
        setCard(() => ({ ...card, ...response }));
        setCardFormData(() => response);
      } catch (aFit) {
        if (aFit.name === "AbortError") {
          console.log(aFit);
        } else {
          setCardFormData({ ...initialCardFormData });
        }
      }
    };

    if (cardId) {
      getCard();
    }

    return () => {
      aborter.abort();
    };
  }, []);

  const handleNewCardSubmit = async (event) => {
    event.preventDefault();
    await createCard(deckId, cardFormData);
    setReRender(!reRender);
    history.push(`/decks/${deckId}`);
  };

  const handleEditCardSubmit = async (event) => {
    event.preventDefault();
    await updateCard(cardFormData);
    setReRender(!reRender);
    history.push(`/decks/${deckId}`);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setCardFormData({ ...initialCardFormData });
    history.push(`/decks/${deckId}`);
  };

  const handleChange = ({ target }) => {
    setCardFormData({
      ...cardFormData,
      [target.name]: target.value,
    });
  };

  return !cardId ? (
    <div>
      <form onSubmit={handleNewCardSubmit}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`decks/${deck.id}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active">Add Card</li>
          </ol>
        </nav>
        <h2>{deck.name}: Add Card</h2>
        <div className="container">
          <div className="row">
            <label htmlFor="front">
              Front
              <textarea
                id="front"
                type="textarea"
                name="front"
                onChange={handleChange}
                value={cardFormData.front}
              />
            </label>
            <label htmlFor="back">
              Back
              <textarea
                id="back"
                type="textarea"
                name="back"
                onChange={handleChange}
                value={cardFormData.back}
              />
            </label>
          </div>
          <div className="row">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Done
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <div>
      <form onSubmit={handleEditCardSubmit}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`decks/${deck.id}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active">Edit Card {card.id}</li>
          </ol>
        </nav>
        <h2>Edit Card {card.id}</h2>
        <div className="container">
          <div className="row">
            <label htmlFor="front">
              Front
              <textarea
                id="front"
                type="textarea"
                name="front"
                onChange={handleChange}
                value={cardFormData.front}
                placeholder={card.front}
              />
            </label>
            <label htmlFor="back">
              Back
              <textarea
                id="back"
                type="textarea"
                name="back"
                onChange={handleChange}
                value={cardFormData.back}
                placeholder={card.back}
              />
            </label>
          </div>
          <div className="row">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Done
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
