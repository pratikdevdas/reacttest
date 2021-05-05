import React, { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  //using above piece of state to store value of user submitted input
  const [showAll, setShowAll] = useState(true);
  //using above piece of state to keep track of which notes to be displayed
  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, []);
  console.log("render", notes.length, "notes");
    
  const toggleImportanceOf = (id) => {  
    //const url = `http://localhost:3002/notes/${id}`
    //defines unique url for each note based on its id
  const note = notes.find(n => n.id === id)
  //find is used to find the note we want to modify and then assign it to note variable
  const changedNote = { ...note, important: !note.important }
   //an object which is exact copy of of old note(it doesnt have important property)
   noteService
   .update(id, changedNote)
   .then(returnedNote => {
    setNotes(notes.map(note => note.id !== id ? note : returnedNote))
  })}

  const addNote = event => {
    event.preventDefault();
    console.log("button clicked", event.target);
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
     
    };
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
}

  const handleNoteChange = event => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };
  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "imp only" : "all"} buttons
        </button>
      </div>
      <ul>
        {notesToShow.map((note,i) => (
          <Note key={i} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}

      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
