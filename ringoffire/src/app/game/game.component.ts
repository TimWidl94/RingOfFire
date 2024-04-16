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
import { doc, getDoc } from 'firebase/firestore';

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
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';
  gameId: string;

  firestore: Firestore = inject(Firestore);

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log('die Params lautet:', params['id']);

      let gameId = params['id'].replace(':', '');
      this.gameId = gameId;
      console.log('gameID =', this.gameId);

      // this.gameService.firestore.collection('games')
      // .doc(params['id']).valueChanges().
      // subscribe((game:any) => {
      // console.log('game update', game)
      // })
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;
      this.pickNextPlayer();
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.pushPickedCards(this.currentCard);
        this.gameService.updateGame(this.game, this.gameId);
      }, 1200);
    }
    console.log('das Game ist :', this.game);
    console.log('die Game Id lautet:', this.gameId);
  }

  newGame() {
    this.game = new Game();
    // let gameObject = {
    // id: this.game.id,
    // players: this.game.players,
    // stack: this.game.stack,
    // playedCards: this.game.playedCards,
    // currentPlayer: this.game.currentPlayer,
    // };
    // this.gameService.addGame(gameObject)
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
