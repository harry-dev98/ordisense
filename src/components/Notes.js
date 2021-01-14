import React, { useState, useRef, useEffect } from 'react';

import { addNote, fetchNotes, delNote } from '../service/api';

const Notes = (props) => {
    const input = useRef();
    const [notes, setNotes] = useState([]);
    useEffect(()=>{
        fetchNotes()
        .then((notes)=>{
            setNotes([...notes]);
        });
    }, [])
    const removeNote = async (note) => {
        let isDeleted = await delNote(note._id)
        if(isDeleted){
            let newNotes = notes.filter((item) => !(note._id===item._id))
            setNotes(newNotes);
        } else {
            console.log("error");
        }
    };
    const addNewNote = () => {
        let newNote = input.current.value;
        if(newNote){
            addNote(newNote)
            .then((addedNote) => {
                setNotes([...notes, addedNote]);
                   input.current.value = "";
            })
            .catch((error) => {
                console.log("error", error);
            });
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
                <i className="fa fa-check" onClick={addNewNote}/>
            </div>
        </div>
    )
}

export default Notes;