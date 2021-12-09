import { useEffect, useRef, useState } from 'react';
import './Notes.css';
import { getNotes, storeNote } from './data/data';
import { Note } from './models/note';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { create } from 'domain';


function Notes(){
    
    const [notes, editNote] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState<string>("");
    const [shownNotes, setShownNotes] = useState<Note[]>(notes);
    const [filter, setFilter] = useState<string>("all");
    const noteField = useRef(null);

    const addNote = () => {
        storeNote({title: "", content: newNote, status: "new"}).then((response) => {
            editNote(response.data);
            // Empty the input after success
            setNewNote("");
            // Rerun filter
            filterNotes(filter);
        });
    }

    const createCard = (note: Note, key: any) => {
        return <Card key={key} className="note-card"> <Card.Title> {note.title} </Card.Title> <Card.Text> {note.content} </Card.Text></Card>;
    }

    const typeNote = (event: any) => {
        setNewNote(event.target.value);
    }

    const filterNotes = (status: string) => {
        // Save filter for future refreshes
        setFilter(status);
        // If all do not filter
        if(status === "all"){
            setShownNotes(notes);
        } else {
            setShownNotes(notes.filter((value, index) => value.status === status));
        }
    }

    useEffect(() => {
        console.log("getting notes");
        getNotes()?.then( res => {
            editNote(res.data)
            setShownNotes(res.data);
        });
    }, [editNote])

    let filterList: any[] = [];

    // Unique status names of notes and set as filters
    notes.map((note, key) => note.status).filter((value, index, self) => self.indexOf(value) === index).forEach((status, index) => {
        filterList.push(<div key={index} onClick={() => filterNotes(status)}> {status} </div>);
    });

    // Create the note cards
    let itemList = shownNotes.map((note, key) => {
        return createCard(note, key);
    })

    return (
        <div>
            <div className="grid-filters">
                {filterList}
            </div>
            <div className="grid-notes">
                {itemList}
            </div>
            <div className="grid-addnote">
                <FormControl ref={noteField} type="text" value={newNote} onChange={typeNote}></FormControl>
                <Button variant="primary" onClick={addNote}> Add note </Button>
            </div>
        </div>
    );
}

export default Notes;
