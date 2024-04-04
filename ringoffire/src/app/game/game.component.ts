import { Game } from './../models/game';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      console.log('New Card', this.currentCard);
      this.pickCardAnimation = true;

      console.log('played Card', this.game.playedCards)
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.pushPickedCards(this.currentCard);
      }, 1250);
    }
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  pushPickedCards(currentCard: string){
    this.game.playedCards.push(currentCard)
  }
}
