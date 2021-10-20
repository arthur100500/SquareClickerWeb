class GlobalObjects{
  static init(){

    // Imagery
    this.background = new Image();
    this.backgroundEmpty = new Image();
    this.greensquare = new Image();
    this.graysquare = new Image();
    this.orangesquare1 = new Image();
    this.orangesquare2 = new Image();
    this.orangesquare3 = new Image();
    this.redsquare = new Image();
    this.bluesquare = new Image();

    this.startbtn = new Image();
    this.retrybtn = new Image();

    // Contexts
    this.resolution = new Pos(588, 702);
    this.canvas = document.getElementById("surf");
    this.surface = null;
    this.comboCounter = document.getElementById("comboC");
    this.scoreCounter = document.getElementById("scoreC");

    // Loading img
    this.background.src = "img/playfield6x.png";
    this.greensquare.src = "img/greensquare6x.png";
    this.graysquare.src = "img/graysquare6x.png";
    this.orangesquare1.src = "img/orangesquare16x.png";
    this.orangesquare2.src = "img/orangesquare26x.png";
    this.orangesquare3.src = "img/orangesquare36x.png";
    this.redsquare.src = "img/redsquare6x.png";
    this.bluesquare.src = "img/bluesquare6x.png";
    this.backgroundEmpty.src = "img/backgroundblank.png";
    this.startbtn.src = "img/start6x.png";
    this.retrybtn.src = "img/retry6x.png";

    //audio
    this.greensound = new Audio('audio/green.mp3');
    this.redsound = new Audio('audio/red.mp3');
    this.bluesound = new Audio('audio/blue.mp3');
    this.orange1sound = new Audio('audio/orange1.mp3');
    this.orange2sound = new Audio('audio/orange2.mp3');
    this.orange3sound = new Audio('audio/orange3.mp3');
    this.defeatsound = new Audio('audio/defeat.mp3');
    this.startsound = new Audio('audio/defeat.mp3');
    this.combobreaksound = new Audio('audio/combobreak.mp3');
  }
}

function getMousePosition(canvas, event, game) {
  let rect = canvas.getBoundingClientRect();
  
  game.click(new Pos((event.clientX - rect.left) * 630 / 588.0, (event.clientY - rect.top) * 754 / 702.0));
  
  console.log(new Pos((event.clientX - rect.left) * 630 / 588.0, (event.clientY - rect.top) * 754 / 702.0))
}

class Game{
  constructor(){
    this.attempt = 1;
    this.health = 5;
    this.state = "s";

    this.score = 0;
    this.combo = 0;
    this.playeddefeat = true;

    this.grid = [[0, 0, 0, 0, 0,], 
                [0, 0, 0, 0, 0,], 
                [0, 0, 0, 0, 0,], 
                [0, 0, 0, 0, 0,], 
                [0, 0, 0, 0, 0,]];
  }
  draw(ctx){
    if (this.state == "r"){
      GlobalObjects.surface.drawImage(GlobalObjects.background, 0, 0, GlobalObjects.resolution.x, GlobalObjects.resolution.y);
      //draw healthbar
      GlobalObjects.surface.fillStyle = "rgb(" + (255 - this.health * 51).toString() + ", " + (this.health *51).toString() + ", 0)"
      GlobalObjects.surface.fillRect(12, 106, 564 * this.health / 5, 12);
      //ctx.strokeStyle = "rgba(255,0,0,0.5)";
      //draw squares
      for (var i = 0; i < 5; i++){
        for (var j = 0; j < 5; j++){
          if(this.grid[i][j] != 0 && this.grid[i][j].id != -1){
            this.grid[i][j].draw(new Pos(4 - j, 4 - i));
          }
          if(this.grid[i][j] != 0 && this.grid[i][j].id == -1){
            this.grid[i][j] = this.grid[i][j].draw(new Pos(4 - j, 4 - i));
          }
        }
      }
      return;
    }

    if (this.state == "s") {
      GlobalObjects.surface.drawImage(GlobalObjects.background, 0, 0, GlobalObjects.resolution.x, GlobalObjects.resolution.y);
      GlobalObjects.surface.drawImage(GlobalObjects.startbtn, 132, 474, 324, 96);
    }

    if (this.state == "d") {
      GlobalObjects.surface.drawImage(GlobalObjects.background, 0, 0, GlobalObjects.resolution.x, GlobalObjects.resolution.y);
      GlobalObjects.surface.drawImage(GlobalObjects.retrybtn, 132, 474, 324, 96);
    }

  }
  start(){
    // start drawing loop at ~60fps
    setInterval(() => this.draw(), 13);
    // start logic loop at ~60fps
    setInterval(() => this.logic(), 13);
  }
  logic(){
    this.health -= 0.013;//* Math.log(this.score + 5) / 5;
    this.health = Math.min(Math.max(this.health, 0), 5);
    if (this.health <= 0 && this.state=="r"){
      this.state = "d";
      this.updateScoreCounters();
      GlobalObjects.comboCounter.innerHTML = "Score: ";
      document.cookie = "sqrclckrrcrd=" + this.score.toString() + ";"; 
      if(this.attempt % 4 == 3){
        window.location.href = 'https://youtu.be/dQw4w9WgXcQ';
      }
      this.attempt++;
    }

  }
  click(pos){
    //clicked
    if (this.state == "s"){
      this.state = "r";
      this.score = 0;
      this.health = 5;
      this.combo = 0;
      this.updateScoreCounters();
      return;

    }
    if (this.state == "d"){
      this.state = "r";
      this.score = 0;
      this.health = 5;
      this.combo = 0;
      this.updateScoreCounters();
      return;
    }

    pos.y = GlobalObjects.resolution.y - pos.y
    for (var i = 18; i < GlobalObjects.resolution.x; i += 19*6){
      //3 * 6, self.window_size[0], self.grid_size
      for(var j = 18; j < GlobalObjects.resolution.y; j += 19*6){
        //(i < x < i + self.grid_size - 3 * 6) and (j < y < j + self.grid_size - 3 * 6):
        if((i < pos.x && pos.x < i + 98) && (j < pos.y && pos.y < j + 98)){
          if (this.grid[4 - Math.floor((j - 18) / 98)][Math.floor((i - 18) / 98)] != 0){
            this.grid[4 - Math.floor((j - 18) / 98)][Math.floor((i - 18) / 98)] = this.grid[4 - Math.floor((j - 18) / 98)][Math.floor((i - 18) / 98)].click(this);
          }
          else{
                this.combo = 0;
                this.health -= 1.5;
          }
          this.restructureGrid();
          this.updateScoreCounters()
          return;
        }
      }
    }
    // missed
    this.combo = 0;
    this.health -= 1.5;
    this.updateScoreCounters()
  }
  updateScoreCounters(){
    GlobalObjects.scoreCounter.innerHTML = this.score;
    GlobalObjects.comboCounter.innerHTML = this.combo.toString() + "x";
  }
  restructureGrid(){
    var c = 0;
    for (var i = 0; i < 5; i++){
      for (var j = 0; j < 5; j++){
        if(this.grid[i][j] != 0 && this.grid[i][j].id != 2 && this.grid[i][j].id != 4 && this.grid[i][j].id != -1){
          c++;
        }
      }
    }
    if (c == 0){
      this.destroyReds();
      this.replaceGrayByRandom();
      this.generateNewPattern();
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  destroyReds(){
    for (var i = 0; i < 5; i++)
      for (var j = 0; j < 5; j++)
        if(this.grid[i][j].id == 2) this.grid[i][j] = 0; 
  }

  replaceGrayByRandom(){
    var red_count = 0;
    for (var i = 0; i < 5; i++)
      for (var j = 0; j < 5; j++)
        if(this.grid[i][j].id == 4){
          var genval = Math.random();
          if (genval < 0.1 && red_count < 2){
            this.grid[i][j] = new RedSquare;
            red_count ++;
            continue;
          } 
          if (genval < 0.5){
            this.grid[i][j] = new GreenSquare;
            continue;
          }

          if (genval < 0.8){
            this.grid[i][j] = new OrangeSquare;
            continue;
          }
          if (genval < 1.0){
            this.grid[i][j] = new BlueSquare;
            continue;
          }
        }
  }

  generateNewPattern(){
    for(var i = 0; i < 5; i++){
      var pos1 = new Pos(this.getRandomInt(5), this.getRandomInt(5));
      if (this.grid[pos1.x][pos1.y] == 0){
        this.grid[pos1.x][pos1.y] = new GraySquare();
      }
    }
  }
}


  class Square{
    constructor(_texture){
      this.texture = _texture;
    }
      draw(pos){
        GlobalObjects.surface.drawImage(this.texture, GlobalObjects.resolution.x - (pos.x + 1) * 19 * 6, GlobalObjects.resolution.y - (pos.y + 1) * 19 * 6, 96, 96);
    }
  }


class Pos{
  constructor(a, b){
    this.x = a;
    this.y = b;
  }
}

class RedSquare extends Square{
  constructor(){
    super(GlobalObjects.redsquare);
    this.id = 2;
  }
  click(game){
    GlobalObjects.redsound.cloneNode(true).play();
    game.health = -1;
    return new SquareFadeoutAnim(this.texture);
  }
}

class GreenSquare extends Square{
  constructor(){
    super(GlobalObjects.greensquare);
    this.id = 1;
  }
  click(game){
    GlobalObjects.greensound.cloneNode(true).play();
    game.combo++;
    game.health += 0.3;
    game.score += Math.floor(Math.sqrt(game.combo + 1));
    return new SquareFadeoutAnim(this.texture);
  }
}

class BlueSquare extends Square{
  constructor(){
    super(GlobalObjects.bluesquare);
    this.id = 3;
  }
  click(game){
    GlobalObjects.bluesound.cloneNode(true).play();
    game.combo++;
    game.health += 5;
    game.score += Math.floor(Math.sqrt(game.combo + 1) * 4);
    return new SquareFadeoutAnim(this.texture);
  }
}

class GraySquare extends Square{
  constructor(){
    super(GlobalObjects.graysquare);
    this.id = 4;
  }
  click(game){
    return this;
  }
}

class SquareFadeoutAnim{
    constructor(_texture){
      this.texture = _texture;
      this.anim_s = 0;
      this.id = -1;
  }
  draw(pos){
    this.anim_s += 1;
    GlobalObjects.surface.globalAlpha = Math.min(30 / (this.anim_s * this.anim_s), 1);
    GlobalObjects.surface.drawImage(this.texture, GlobalObjects.resolution.x - (pos.x + 1) * 19 * 6 - this.anim_s, GlobalObjects.resolution.y - (pos.y + 1) * 19 * 6 - this.anim_s, 96 + 2 * this.anim_s, 96 + 2 * this.anim_s);
    GlobalObjects.surface.globalAlpha = 1;
    if (this.anim_s > 30){
      return 0;
    }
    return this;
  }
}
class OrangeSquare extends Square{
  constructor(){
    super(GlobalObjects.orangesquare3);
    this.id = 5;
    this.number = 3;
  }
  click(game){
    if (this.number == 1) GlobalObjects.orange1sound.cloneNode(true).play();
    if (this.number == 2) GlobalObjects.orange2sound.cloneNode(true).play();
    if (this.number == 3) GlobalObjects.orange3sound.cloneNode(true).play();
    game.combo++;
    game.health += 0.3;
    game.score += Math.floor(Math.sqrt(game.combo + 1));
    this.number -= 1;
    super.texture = this.number == 2 ? GlobalObjects.orangesquare2 : GlobalObjects.orangesquare1
    return this.number == 0 ? new SquareFadeoutAnim(this.texture) : this;
  }
}

function main(){
  var game = new Game();
  game.generateNewPattern();
  game.restructureGrid();
  game.start();
  // Bind controls
  GlobalObjects.canvas.addEventListener("mousedown", function(e)
  {
    getMousePosition(GlobalObjects.canvas, e, game);
  });
}


GlobalObjects.init();
GlobalObjects.canvas = document.getElementById("surf");
GlobalObjects.surface = document.getElementById("surf").getContext('2d');

setTimeout(main, 50);
