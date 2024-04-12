import { Game } from './../models/game';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';

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
      // id: id || '',
      players: obj.players || '',
      stack: obj.stack || '',
      playedCards: obj.playedCards || '',
      currentPlayer: obj.currentPlayer || '',
    };
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  async addDoc(item: Game) {
    await addDoc(this.getGamesRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef);
      });
  }

  async updateGame(game: Game) {
  if (game.id) {
  let docRef = this.getSingleDocRef("games", game.id);
  await updateDoc(docRef, this.getCleanJson(game))
  .catch((err) => {
  console.log(err);
  })
  .then(() => {});
  }
  }

  getSingleDocRef(colId: string, docId: string) {
  return doc(collection(this.firestore, colId), docId);
  }

  getCleanJson(game:Game){
  return {
  // id: game.id,
  players: game.players,
  stack: game.stack,
  playedCards: game.playedCards,
  currentPlayer: game.currentPlayer,
  }
  }
}
