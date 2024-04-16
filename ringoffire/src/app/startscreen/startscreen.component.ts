import { Component } from '@angular/core';
import { Firestore, addDoc } from '@angular/fire/firestore';
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
  constructor(private router: Router, private gameService: GameService) {}

  game: Game;
  gameObject: Game;
  gameInfo: string;

  async newGame() {
    let game = new Game();
    let gameObject = {
      id: game.id,
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
    };

    let gameInfo = await addDoc(this.gameService.getGamesRef(), gameObject);
    console.log('gameInfo', gameInfo);
    this.router.navigateByUrl('/game/:' + gameInfo.id);

    // this.gameService.addGame(this.gameObject).then((gameObject: any)=> {
    // console.log(gameObject);

    // });
  }
}
