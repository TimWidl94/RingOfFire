import { Game } from './../models/game';
import { Injectable, inject, Component } from '@angular/core';
import {
  Firestore,
  query,
  orderBy,
  limit,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  game: Game[] = [];
  gameObject: Game;


  unsubGame;


  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubGame = this.subGameList();
  }

  // const itemCollection = collection(this.firestore, 'items');

  ngonDestroy() {
    this.subGameList();
  }

  subGameList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      this.game = [];
      list.forEach((element) => {
        this.game.push(this.setGameObject(element.data(), element.id));
      });
    });
  }

  setGameObject(obj: Game, id: string): Game {
    return {
      players: obj.players,
      stack: obj.stack,
      playedCards: obj.playedCards,
      currentPlayer: obj.currentPlayer,
      shuffle: obj.shuffle
    };

  }



  getGamesRef() {
    return collection(this.firestore, 'games');
  }



  // async addNote(item: Note, colId: 'notes' | 'trash') {
    // if (colId == 'notes') {
      // await addDoc(this.getNotesRef(), item)
        // .catch((err) => {
          // console.error(err);
        // })
        // .then((docRef) => {
          // console.log('Document written with ID: ', docRef);
        // });
    // } else {
      // await addDoc(this.getTrashRef(), item);
    // }
  // }
//
  // async deleteNote(colId: 'notes' | 'trash', docId: string) {
    // console.log(this.getSingleDocRef(colId, docId));
    // await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      // console.log(err);
    // });
  // }
}
