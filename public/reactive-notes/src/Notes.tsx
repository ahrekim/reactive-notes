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
    const [openCard, setOpenCard] = useState<number>(0);
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
        return <div key={key} className={`transition relative ease-in-out delay-150 rounded-lg bg-opacity-70 shadow-md bg-slate-800 text-stone-50 note-card hover:bg-opacity-90 status-${note.status.replace(/\s+/g, '-').toLowerCase()}`}>
            <Card.Title> {note.title} </Card.Title>
            <div className={"max-h-32 overflow-hidden pb-16 font-light"}> {note.content} </div>
            <div className="actions flex flex-wrap overflow-x-hidden absolute bottom-0 pb-2">
                <button className="chip p-2 rounded-lg mr-2 bg-slate-900 bg-opacity-50 col-span-1 w-auto">
                    Edit
                </button>
                <button className="chip p-2 rounded-lg mr-2 bg-red-700 bg-opacity-50 col-span-1 w-auto">
                    Delete
                </button>
            </div>
        </div>;
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
        let selectedClass = "bg-violet-800 hover:bg-gradient-to-tl from-fuchsia-600 to-slate-900 bg-slate-900 bg-opacity-70 drop-shadow-md text-sky-300";
        if(status === filter){
            selectedClass = "bg-gradient-to-tl from-fuchsia-600 to-violet-800";
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
                <div onClick={() => filterNotes("all")} className={(filter == 'all') ? 'rounded-full bg-gradient-to-tl from-fuchsia-600  to-violet-800' : 'hover:bg-gradient-to-tl from-fuchsia-600 to-slate-900 text-stone-50 rounded-full bg-slate-900 bg-opacity-70 shadow-md'}> All </div>
                {filterList}
            </div>
            <div className="grid grid-flow-row gap-2 grid-cols-2 md:grid-cols-3">
                {itemList}
            </div>
            <div className="grid-addnote mt-4">
                <input className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-slate-900 shadow-md bg-opacity-70 text-stone-50"
                    ref={noteTitleField}
                    type="text"
                    name="title"
                    value={newNote.title}
                    onChange={typeNote}
                    placeholder="Title..."
                />
                <button
                    type="button"
                    className="group relative w-full flex justify-center py-2 px-4 text-stone-50 text-sm font-medium rounded-lg bg-opacity-10 shadow-md  bg-gradient-to-tl from-fuchsia-600  to-violet-800"
                    onClick={addNote}
                    disabled={!formIsValid()}
                >
                Add note
              </button>
            </div>
            <div className="textarea-container">
            <textarea className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-slate-900 shadow-md bg-opacity-70 text-stone-50"
                    ref={noteContentField}
                    rows={5}
                    name="content"
                    onChange={typeNote}
                    placeholder="Content..."
                    value={newNote.content}
                ></textarea>
            </div>
        </div>
    );
}

export default Notes;
