var ctx;
var pane;
var size = 45;

var mineRate = 0.20;
var xm = 20;
var ym = 10;

function main(){
    var my = document.getElementById("mycanvas")
    my.width = size * xm;
    my.height = size * ym; 
    my.oncontextmenu = (e) => e.preventDefault();
    my.addEventListener('mouseup', on_click);
    document.getElementById("label").addEventListener('click', lbClick);
    ctx = my.getContext("2d");
    ctx.font = "20px Consolas";

    var mineNum = Math.floor(xm * ym * mineRate);
    pane = new Field(xm, ym, mineNum);
    //pane.init();
}

function on_click(ev){
    var boundingRect = ev.target.getBoundingClientRect();
    var x = Math.floor((ev.clientX - boundingRect.left) / size);
    var y = Math.floor((ev.clientY - boundingRect.top) / size);
    switch(ev.which){
        case 1:
            if(pane.pane[x][y].m){
                pane.reviewMine();
                document.getElementById("label").innerText  = "Click here to play again";
            } else {
                pane.pane[x][y].fill("lightblue");
                if(pane.pane[x][y].n != 0){
                    pane.pane[x][y].text(pane.pane[x][y].n);
                }
            }
            break;
        case 2:
            pane.init();
            break;
        case 3:
            pane.pane[x][y].fill("darkred");
            break;
        default:
            ctx.fillStyle = "white";
    }
}

function lbClick(ev){
    pane.init();
}

class Field{
    constructor(xm, ym, mineNumber){
        this.xLength = xm;
        this.yLength = ym;
        this.mineNumber = mineNumber;

        this.pane = new Array(xm);
        for(var i = 0;  i < xm; i++){
            this.pane[i] = new Array(ym);
            for(var j = 0;  j < ym; j++){
                this.pane[i][j] = new Cell(i, j);
                this.pane[i][j].border();
            }
        }
    }

    generateMines(){
        var total = this.xLength * this.yLength;
        var mine = this.mineNumber;
        for(var i = 0;  i < this.xLength; i++){
            for(var j = 0;  j < this.yLength; j++){
                var m = false;
                var r = Math.floor(Math.random() * total);
                if(r < mine){
                    this.pane[i][j].m = true;
                    mine--;
                } else {
                    this.pane[i][j].m = false;
                }
                total--;
            }
        }
    }

    reviewMine(){
        for(var i = 0;  i < this.xLength; i++){
            for(var j = 0;  j < this.yLength; j++){
                if(this.pane[i][j].m){
                    this.pane[i][j].fill("black");
                }
            }
        }
    }

    calculateMineNumber(){
        for(var i = 0; i < this.xLength; i++){
            for(var j = 0; j < this.yLength; j++){
                var count = 0;
                this.pane[i][j].n = 0;
                this.pane[i][j].fill("lightgrey");
                if(this.pane[i][j].m){
                    continue;
                }
                var xm = this.xLength;
                var ym = this.yLength;
                if(i > 0 &&    j > 0 &&    this.pane[i-1][j-1].m) this.pane[i][j].n++;
                if(i > 0 &&                this.pane[i-1][j].m)   this.pane[i][j].n++;
                if(i > 0 &&    j < ym-1 && this.pane[i-1][j+1].m) this.pane[i][j].n++;
                if(            j > 0 &&    this.pane[i][j-1].m)   this.pane[i][j].n++;
                if(            j < ym-1 && this.pane[i][j+1].m)   this.pane[i][j].n++;
                if(i < xm-1 && j > 0 &&    this.pane[i+1][j-1].m) this.pane[i][j].n++;
                if(i < xm-1 &&             this.pane[i+1][j].m)   this.pane[i][j].n++;
                if(i < xm-1 && j < ym-1 && this.pane[i+1][j+1].m) this.pane[i][j].n++;
            }
        }
    }

    init(){
        document.getElementById("label").innerText  = "START";
        this.generateMines();
        this.calculateMineNumber();
    }
}


class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    border(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x * size, this.y * size, size, 1);
        ctx.fillRect(this.x * size, this.y * size, 1, size);
        ctx.fillRect(this.x * size, (this.y + 1) * size - 1, size, 1);
        ctx.fillRect((this.x + 1) * size - 1, this.y * size, 1, size);
    }

    fill(color){
        ctx.fillStyle = color;
        ctx.fillRect(this.x * size + 1, this.y * size + 1, size - 2, size - 2)
    }
    
    text(text){
        ctx.fillStyle = "black";
        if(text == undefined){
            text = '';
        }
        ctx.fillText(text, this.x * size + 5, this.y * size + 16);
    }
}
