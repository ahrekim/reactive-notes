import axios from "axios";
import { Note } from "../models/note";
import { User } from "../models/user";
    
export function storeUser(user: User){
    window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(){
    let user = window.localStorage.getItem("user");
    let parsedUser: User;
    if(typeof user == 'string'){
        parsedUser = JSON.parse(user);
        return parsedUser;
    }
}

export function getNotes(){
    return axios.get<Note[]>(`http://localhost:8080/api/notes`);
    if(getUser()){
    }
}

export function storeNote(note: Note){
    return axios.post<Note[]>(`http://localhost:8080/api/newnote`, note);
    // if(getUser()){
    // }
}