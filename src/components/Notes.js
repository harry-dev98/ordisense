import React, { useState, useRef } from 'react';

const Notes = (props) => {
    const input = useRef();
    const [notes, setNotes] = useState([
        {id: 1, note: 'note1'}, 
        {id: 2, note: 'note2'},
    ]);
    const removeNote = (note) => {
        let newNotes = notes.filter((item) => !(note.id===item.id))
        setNotes(newNotes);
    };
    const addNote = () => {
        let newNote = input.current.value;
        if(newNote){
            setNotes([...notes, {id: notes.length, note: newNote}]);
            input.current.value = "";
        }
    };

    return (
        <div className="notes-list">
            <h3 className="heading">Notes</h3>
            {notes.map((note) => (
                <div className="notes-list-item" key={note.id}>
                    <p>{note.note}</p>
                    <i className="fa fa-times" onClick={()=>removeNote(note)}/>
                </div>
            ))}
            <div className="notes-list-item at-bottom">
                <input type="text" ref={input} />
                <i className="fa fa-check" onClick={addNote}/>
            </div>
        </div>
    )
}

export default Notes;