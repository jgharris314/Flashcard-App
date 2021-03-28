import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { createDeck, updateDeck, readDeck } from "../utils/api";

export default function DeckForm({ deck, reRender, setReRender, setDeck }) {
  const history = useHistory();
  const { deckId } = useParams();

  const initialFormData = {
    name: "",
    description: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  useEffect(() => {
    const aborter = new AbortController();
    const getDeck = async () => {
      try {
        const response = await readDeck(deckId, aborter.signal);
        setDeck(() => ({ ...deck, ...response }));
        setFormData(() => response);
      } catch (aFit) {
        if (aFit.name === "AbortError") {
          console.log(aFit);
        } else {
          setFormData({ ...initialFormData });
        }
      }
    };

    if (deckId) {
      getDeck();
    }

    return () => {
      aborter.abort();
    };
  }, []);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createDeck(formData)
      .then((response) => history.push(`/decks/${response.id}`))
      .then(setReRender(!reRender));
    setFormData({ ...initialFormData });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setFormData({ ...initialFormData });
    history.push("/");
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    await updateDeck(formData)
      .then((response) => history.push(`/decks/${response.id}`))
      .then(setReRender(!reRender));
  };

  return !deckId ? (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Create Deck</li>
        </ol>
      </nav>
      <form onSubmit={handleSubmit}>
        <h1>Create Deck</h1>
        <div className="container">
          <div className="row">
            <label htmlFor="deckName">
              Deck Name:
              <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
              />
            </label>
          </div>
          <div className="row">
            <label htmlFor="deckDescription">
              Deck Description:
              <textarea
                id="description"
                type="textarea"
                name="description"
                onChange={handleChange}
                value={formData.description}
              />
            </label>
          </div>
          <div className="row">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Edit Deck</li>
        </ol>
      </nav>
      <form onSubmit={handleEditSubmit}>
        <h1>Edit Deck</h1>
        <div className="container">
          <div className="row">
            <label htmlFor="deckName">
              Deck Name:
              <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder={deck.name}
              />
            </label>
          </div>
          <div className="row">
            <label htmlFor="description">
              Deck Description:
              <textarea
                id="description"
                type="textarea"
                name="description"
                onChange={handleChange}
                value={formData.description}
                placeholder={deck.description}
              />
            </label>
          </div>
          <div className="row">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
