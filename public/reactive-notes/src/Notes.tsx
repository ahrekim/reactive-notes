import { useEffect, useRef, useState } from 'react';
import './Notes.css';
import { getNotes, storeNote } from './data/data';
import { Note } from './models/note';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Form, FormControl } from 'react-bootstrap';

function Notes(){
    const [notes, editNote] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState<Note>({title: "", content: "", status: "new"});
    const [shownNotes, setShownNotes] = useState<Note[]>(notes);
    const [filter, setFilter] = useState<string>("all");
    const noteTitleField = useRef(null);
    const noteContentField = useRef(null);

    const addNote = () => {
        if(formIsValid()){
            storeNote(newNote).then((response) => {
                editNote(response.data);
                // Empty the input after success
                setNewNote({title: "", content: "", status: "new"});
            });
        }
    }

    const formIsValid = () => (newNote.title || (newNote.title && newNote.title)) ? true : false;

    const createCard = (note: Note, key: any) => {
        return <Card key={key} className={`note-card status-${note.status.replace(/\s+/g, '-').toLowerCase()}`}> <Card.Title> {note.title} </Card.Title> <Card.Text> {note.content} </Card.Text></Card>;
    }

    const typeNote = (event: any) => {
        setNewNote({...newNote, [event.target.name]: event.target.value});
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
        filterNotes(filter);
    }, [notes])

    useEffect(() => {
        getNotes()?.then( res => {
            editNote(res.data)
            setShownNotes(res.data);
        });
    }, [editNote])

    let filterList: any[] = [];

    // Unique status names of notes and set as filters
    notes.map((note, key) => note.status).filter((value, index, self) => self.indexOf(value) === index).forEach((status, index) => {
        let selectedClass = "bg-violet-800 hover:bg-gradient-to-t from-fuchsia-600 bg-violet-500 text-sky-300";
        if(status === filter){
            selectedClass = "bg-gradient-to-t from-fuchsia-600 to-[#F26419]";
        }
        filterList.push(<div key={index} onClick={() => filterNotes(status)} className={'rounded-full '+selectedClass}> {status} </div>);
    });

    // Create the note cards
    let itemList = shownNotes.map((note, key) => {
        return createCard(note, key);
    })

    return (
        <div className="backdrop-opacity-10">
            <div className="grid-filters">
            <div onClick={() => filterNotes("all")} className={(filter == 'all') ? 'rounded-full bg-gradient-to-t from-fuchsia-600  to-[#F26419]' : 'text-sky-300 rounded-full bg-violet-800'}> All </div>
                {filterList}
            </div>
            <div className="grid-notes">
                {itemList}
            </div>
            <div className="grid-addnote">
                <input className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    ref={noteTitleField}
                    type="text"
                    name="title"
                    value={newNote.title}
                    onChange={typeNote}
                    placeholder="Title..."
                />
                <button
                    type="button"
                    className="group relative w-full flex justify-center py-2 px-4 border-1 border-fuchsia-600 text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={addNote}
                    disabled={!formIsValid()}
                >
                Add note
              </button>
            </div>
            <div className="textarea-container">
                <FormControl as="textarea" rows={3} ref={noteContentField} name="content" value={newNote.content} onChange={typeNote} placeholder="Content..."></FormControl>
            </div>
        </div>
    );
}

export default Notes;
