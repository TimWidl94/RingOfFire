import { routes } from './../app.routes';
import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from './../models/game';
import { GameService } from './../game-service/game.service';


@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss',
})
export class StartscreenComponent {
  constructor(
    private router: Router,
    private firestore: Firestore,
    private gameService: GameService
  ) {}

  newGame() {
    this.router.navigateByUrl('/game');

    // let game = new Game();
    // let gameObject = {
      // id: this.game.id,
      // players: game.players,
      // stack: game.stack,
      // playedCards: game.playedCards,
      // currentPlayer: game.currentPlayer,
    // };
    // this.gameService.addDoc(gameObject).then((gameInfo: any)=> {
      // console.log(gameObject);
      // this.router.navigateByUrl('/game' + gameInfo);
    // });
  }
}
