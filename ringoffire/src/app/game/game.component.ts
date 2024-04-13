import { GameService } from './../game-service/game.service';
import { GameInfoComponent } from './../game-info/game-info.component';
import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { Game } from './../models/game';
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

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

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log('die Params lautet:', params);
      // this.gameId = params.id;
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
      }, 1200);
    }
    this.gameService.updateGame(this.game);
  }

  newGame() {
    this.game = new Game();
    // console.log(this.game);
  }

  pushPickedCards(currentCard: string) {
    this.game.playedCards.push(currentCard);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 0) {
        this.game.players.push(name);
      }
    });
  }

  pickNextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }
}
