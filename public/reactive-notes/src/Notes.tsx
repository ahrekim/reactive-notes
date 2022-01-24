import { useEffect, useRef, useState } from 'react';
import './Notes.css';
import EditModal from './EditModal';
import { getNotes, storeNote } from './data/data';
import { Note } from './models/note';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Form, FormControl } from 'react-bootstrap';
import {getFirestore, collection, addDoc, getDocs, onSnapshot, where, query, doc, deleteDoc, getDoc, DocumentReference, setDoc} from 'firebase/firestore'
import { getAuth } from '@firebase/auth';
import DeleteModal from './DeleteModal';

function Notes(props: any){
    const [notes, setEditNote] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState<Note>({title: "", content: "", status: "New"});
    const [shownNotes, setShownNotes] = useState<Note[]>(notes);
    const [filter, setFilter] = useState<string>("all");
    const [openCard, setOpenCard] = useState<Note>({title: "", content: "", status: "New"});
    const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);
    const [deleteCardIsOpen, setDeleteCardIsOpen] = useState<boolean>(false);
    const noteTitleField = useRef(null);
    const noteContentField = useRef(null);
    const db = getFirestore(props.firebaseApp);

    const typeEditNote = (event: any) => {
        setOpenCard({...openCard, [event.target.name]: event.target.value});
    }

    const addNote = () => {
        if(formIsValid()){
            let note = newNote;
            note.uid = props.user.uid;
            addDoc(collection(db, 'notes'), note).then(() => {
                // Empty the input after success
                setNewNote({title: "", content: "", status: "New"});
                getDocuments(true);
            })
        }
    }

    const formIsValid = () => (newNote.title || (newNote.title && newNote.title)) ? true : false;

    const createCard = (note: Note, key: any) => {
        return <div key={key} className={`transition relative ease-in-out delay-150 rounded-lg bg-opacity-70 shadow-md bg-slate-800 text-stone-50 note-card hover:bg-opacity-90 status-${note.status.replace(/\s+/g, '-').toLowerCase()}`}>
            <Card.Title> {note.title} </Card.Title>
            <div className={"max-h-32 overflow-hidden pb-16 font-light"}> {note.content} </div>
            <div className="actions flex flex-wrap overflow-x-hidden absolute bottom-0 pb-2">
                <button onClick={() => editNote(note)} className="chip p-2 rounded-lg mr-2 bg-slate-900 bg-opacity-50 col-span-1 w-auto">
                    Edit
                </button>
                <button onClick={() => deleteNote(note)} className="chip p-2 rounded-lg mr-2 bg-red-700 bg-opacity-50 col-span-1 w-auto">
                    Delete
                </button>
            </div>
        </div>;
    }

    const editModalOpen = (value: boolean) => {
        setCardIsOpen(value);
    }
    const deleteModalOpen = (value: boolean) => {
        setDeleteCardIsOpen(value);
    }

    const deleteNote = (note: Note) => {
        setOpenCard(note);
        setDeleteCardIsOpen(true);
    }

    const confirmDelete = () => {
        if(openCard.id){
            deleteDoc(doc(db, 'notes', openCard.id)).then( () => {
                getDocuments(true);
                setDeleteCardIsOpen(false);
            });
        }
    }

    const editNote = (note: Note) => {
        setOpenCard(note);
        setCardIsOpen(true);
    }

    const confirmUpdate = () => {
        if(openCard.id){
            setDoc(doc(db, 'notes', openCard.id), openCard).then(() => {
                getDocuments(true);
                setCardIsOpen(false);
            })
        }
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

    const getDocuments = (updateFilters: boolean) => {
        let q = query(collection(db, 'notes'), where("uid", "==", props.user.uid));
        getDocs(q).then((data) => {
            let collectedNotes: any = [];
            data.forEach((doc) => {
                let data = doc.data()
                data.id = doc.id;
                collectedNotes = [...collectedNotes, data];
            });
            setEditNote(collectedNotes)
            if(updateFilters){
                setShownNotes(collectedNotes);
            }
        });
    }

    useEffect(() => {
        getDocuments(true);
    }, [setEditNote])

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
            {props.user ?
            <div>
                <div className="grid-filters">
                    <div onClick={() => filterNotes("all")} className={(filter == 'all') ? 'rounded-full bg-gradient-to-tl from-fuchsia-600  to-violet-800 text-stone-50' : 'hover:bg-gradient-to-tl from-fuchsia-600 to-slate-900 text-stone-50 rounded-full bg-slate-900 bg-opacity-70 shadow-md'}> All </div>
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
                    <textarea className="p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-slate-900 shadow-md bg-opacity-70 text-stone-50"
                            ref={noteContentField}
                            rows={5}
                            name="content"
                            onChange={typeNote}
                            placeholder="Content..."
                            value={newNote.content}
                        >
                    </textarea>
                </div>
            </div>
            :
            ""}
            <EditModal open={cardIsOpen} note={openCard} typeEditNoteFn={typeEditNote} editModalOpenFn={editModalOpen} confirmUpdateFn={confirmUpdate} ></EditModal>
            <DeleteModal open={deleteCardIsOpen} note={openCard} deleteModalOpenFn={deleteModalOpen} confirmDeleteFn={confirmDelete}></DeleteModal>
        </div>
    );
}

export default Notes;
