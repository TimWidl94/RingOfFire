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
import { GameComponent } from '../game/game.component';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  game: Game[] = [];
  gameObject: Game[] = [];

  unsubGame;

  firestore: Firestore = inject(Firestore);

  constructor(
  ) {
    this.unsubGame = this.subGameList();
  }

  ngonDestroy() {
    this.subGameList();
  }

  subGameList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      this.game = [];
      list.forEach((element) => {
        this.gameObject.push(this.setGameObject(element.data(), element.id));
        console.log('Snapshot Data', this.gameObject);
        if(element.id){
          console.log('id gefunden')
        }
      });
    });
  }

  setGameObject(obj: any, id: string): Game {
    return {
      id: id || '',
      players: obj.players || '',
      stack: obj.stack || '',
      playedCards: obj.playedCards || '',
      currentPlayer: obj.currentPlayer || 0,
    };
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  async addGame(game: Game) {
    await addDoc(this.getGamesRef(), this.getCleanJson(game))
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef);
      });
  }

  async updateGame(game: Game, gameId: string) {
    if (gameId) {
      let docRef = this.getSingleDocRef('games', gameId);
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

  getCleanJson(game: Game) {
    return {
      id: game.id,
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
    };
  }
}
