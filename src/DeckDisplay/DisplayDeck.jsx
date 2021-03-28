import React, { Fragment, useEffect } from "react";
import { Link, useParams, useHistory, useRouteMatch } from "react-router-dom";
import { readDeck, deleteDeck } from "../utils/api";
import CardList from "./CardList";


export default function DisplayDeck({ deck, setDeck, reRender, setReRender }) {
  const history = useHistory();
  const { deckId } = useParams();
  const { url } = useRouteMatch();

  useEffect(() => {
    const aborter = new AbortController();
    setDeck({});
    const getDeck = async () => {
      try {
        const response = await readDeck(deckId, aborter.signal);
        setDeck(() => ({ ...deck, ...response }));
        setReRender(!reRender);
      } catch (aFit) {
        if (aFit.name === "AbortError") {
          console.log(aFit);
        } else {
          throw aFit;
        }
      }
    };

    getDeck();

    return () => {
      aborter.abort();
    };
  }, [deckId]);

  const handleEdit = (event) => {
    event.preventDefault();
    history.push(`${url}/edit`);
  };

  const handleDelete = async () => {
    const result = window.confirm("Are you sure you want to delete?");

    if (result) {
      await deleteDeck(deck.id);

      history.push("/");
      history.go(0);
    }
  };

  return (
    <Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{deck.name}</li>
        </ol>
      </nav>
      <div className="container">
        <div className="row">
          <h1>{deck.name}</h1>
        </div>
        <div className="row">
          <div>{deck.description}</div>
        </div>
        <div className="row my-3">
          <div className="col-11">
            <button className="btn btn-secondary" onClick={handleEdit}>
              Edit
            </button>
            <Link
              className="btn btn-primary mx-1"
              to={`/decks/${deck.id}/study`}
            >
              Study
            </Link>
            <Link
              className="btn btn-primary"
              to={`/decks/${deck.id}/cards/new`}
            >
              Add Cards
            </Link>
          </div>
          <div className="col-1">
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
        <div className="row">
          <h2>Cards</h2>
          <div>
            <CardList cards={deck.cards} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
