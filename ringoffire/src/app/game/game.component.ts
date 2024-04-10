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
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

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

  constructor(public dialog: MatDialog, ) {}

  ngOnInit(): void {
    this.newGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      console.log('New Card', this.currentCard);
      this.pickCardAnimation = true;
      this.pickNextPlayer();
      console.log('played Card', this.game.playedCards);
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.pushPickedCards(this.currentCard);
      }, 1200);
    }
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
      }
    });
  }

  pickNextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }
}
