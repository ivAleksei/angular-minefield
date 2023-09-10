import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minefield';
  width: number = 0;
  height: number = 0;
  n_bombs: number = 0;
  map_board: any = {};
  board: any = [];
  reveal: boolean = false;

  n_revealed = 0;

  constructor() {
    this.defaultStart();
  }

  defaultStart() {
    this.width = 20;
    this.height = 20;
    this.n_revealed = 0;
    this.n_bombs = 50;
    this.setupBoard();
  }

  setupBoard() {
    this.reveal = false;
    this.board = {};

    this.setSize(this.width, this.height);
    this.setBombs(this.n_bombs);

    this.setBoard();

  }

  setBoard() {
    this.board = Object.values(this.map_board || {}).map(r => Object.values(r || {}));
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;

    for (let r = 0; r < w; r++) {
      if (!this.map_board[r]) this.map_board[r] = {};
      for (let c = 0; c < h; c++) {
        this.map_board[r][c] = {
          bomb: null,
          count: 0,
          status: 0
        };
      }
    }
  }

  randomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

  setBombs(n: any) {
    if (n < 1) return;
    this.n_bombs = n;

    let i = 0;
    do {
      let j = this.randomNumber(this.width), k = this.randomNumber(this.height);
      if (this.map_board[j][k].bomb) continue;
      this.map_board[j][k].bomb = 1;
      i++;
    } while (i < n);

    for (let i in this.map_board) {
      for (let j in this.map_board[i]) {
        this.map_board[i][j].count = this.countCell(+i, +j);
      }
    }
  }

  countCell(i: number, j: number) {
    if (this.map_board[i][j].bomb) return null;

    let sum = 0;

    let limit_up = i == 0;
    let limit_down = i == this.height - 1;


    let limit_right = j == this.width - 1;
    let limit_left = j == 0;

    if (!limit_up) {
      if (this.map_board[i - 1][j].bomb) sum += 1;
      if (!limit_left && this.map_board[i - 1][j - 1].bomb) sum += 1;
      if (!limit_right && this.map_board[i - 1][j + 1].bomb) sum += 1;
    }

    if (!limit_left && this.map_board[i][j - 1].bomb) sum += 1;
    if (!limit_right && this.map_board[i][j + 1].bomb) sum += 1;

    if (!limit_down) {
      if (!limit_left && this.map_board[i + 1][j - 1].bomb) sum += 1;
      if (this.map_board[i + 1][j].bomb) sum += 1;
      if (!limit_right && this.map_board[i + 1][j + 1].bomb) sum += 1;
    }
    return sum;
  }

  checkClick(i: number, j: number) {
    // SE BOMBA PERDE O JOGO
    if (this.board[i][j].bomb) return this.loseGame();

    // SE VAZIO SEGUE RECURSAO ABRINDO VAZIOS
    if (this.board[i][j].count) {
      this.board[i][j].show = 1;
    } else {
      this.revealCell(+i, +j)
    }

    // this.board[i][j].status = ((this.board[i][j].status || 0) + 1) % 3;
  }

  revealCell(i: number, j: number) {
    let limit_up = i == 0;
    let limit_down = i == this.height - 1;
    let limit_right = j == this.width - 1;
    let limit_left = j == 0;

    if (this.map_board[i][j].show || this.map_board[i][j].bomb || this.map_board[i][j].count) return;

    this.map_board[i][j].show = 1;

    if (!limit_up) this.revealCell(i - 1, j);
    if (!limit_left) this.revealCell(i, j - 1);
    if (!limit_down) this.revealCell(i + 1, j);
    if (!limit_right) this.revealCell(i, j + 1);
  }


  loseGame() {
    this.reveal = true;
  }



}
