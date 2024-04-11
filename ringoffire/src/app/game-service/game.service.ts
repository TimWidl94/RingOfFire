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
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  game: Game[] = [];


  unsubGame;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubGame = this.subGameList();
  }

  ngonDestroy() {
    this.subGameList();
  }

  subGameList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      this.game = [];
      list.forEach((element) => {
        this.game.push(this.setGameObject(element.data(), element.id));
      });
      console.log(this.game);
    });
  }

  setGameObject(obj: any, id: string): Game {
    return {
      players: obj.players,
      stack: obj.stack,
      playedCards: obj.playedCards,
      currentPlayer: obj.currentPlayer,

    };
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  async addDoc(item: Game, colId: 'games') {
    if (colId == 'games') {
      await addDoc(this.getGamesRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef);
        });
    }
  }

  // async deleteNote(colId: 'notes' | 'trash', docId: string) {
  // console.log(this.getSingleDocRef(colId, docId));
  // await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
  // console.log(err);
  // });
  // }
}
