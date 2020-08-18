import React, { useReducer } from "react";
//import { uuid } from "uuid";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";

import {
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  CLEAR_FILTER,
  CLEAR_CURRENT,
  FILTER_CONTACTS,
  SET_CURRENT,
} from "../types";

const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: "Gabriela Neves",
        email: "gabi@gmail.com",
        phone: "111-111-111",
        type: "personal",
      },
      {
        id: 2,
        name: "Pedro Neves",
        email: "pedro@gmail.com",
        phone: "222-111-111",
        type: "personal",
      },
      {
        id: 3,
        name: "Leonardo Neves",
        email: "leo@gmail.com",
        phone: "333-111-111",
        type: "professional",
      },
    ],
    current: null,
    filtered: null,
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Add contact
  const addContact = (contact) => {
    //contact.id = uuid.v4();
    contact.id = 4;
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  // Delete contact
  const deleteContact = (id) => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  // Update contact
  const updateCurrent = (contact) => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  // Set current contact
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear current contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        clearCurrent,
        setCurrent,
        updateCurrent,
        clearFilter,
        filterContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
