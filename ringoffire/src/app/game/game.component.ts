import { GameService } from './../game-service/game.service';
import { GameInfoComponent } from './../game-info/game-info.component';
import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { Game } from './../models/game';
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    DialogAddPlayerComponent,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {

  game: Game;

  gameId: string;

  firestore: Firestore = inject(Firestore);
  unsubGame: any;

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log('die Params lautet:', params['id']);
      this.gameId = params['id'];
      let docRef = this.gameService.getSingleDocRef('games', this.gameId);
      this.unsubGame = onSnapshot(docRef, (gameData) => {
        let game = gameData.data();
        console.log('gameData', game);
        if (game) {
          this.game.currentPlayer = game['currentPlayer'];
          this.game.playedCards = game['playedCards'];
          this.game.players = game['players'];
          this.game.stack = game['stack'];
          this.game.pickCardAnimation = game['pickCardAnimtion'];
          this.game.currentCard = game['currentCard'];
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubGame();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.gameService.updateGame(this.game, this.gameId);
      this.game.pickCardAnimation = true;
      this.pickNextPlayer();
      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.pushPickedCards(this.game.currentCard);
        this.gameService.updateGame(this.game, this.gameId);
      }, 1200);
    }
    console.log('das Game ist :', this.game);
    console.log('die Game Id lautet:', this.gameId);
  }

  newGame() {
    this.game = new Game();
  }

  pushPickedCards(currentCard: string) {
    this.game.playedCards.push(currentCard);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 0) {
        this.game.players.push(name);
        this.gameService.updateGame(this.game, this.gameId);
      }
    });
  }

  pickNextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
    this.gameService.updateGame(this.game, this.gameId);
  }
}
