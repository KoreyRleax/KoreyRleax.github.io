var game = {
    score: 0,
    time: 0,
    status: 0,
    BulletArray: [],
    enemyArray: [],
    "fly": function () {
        BulletFlyTimer = setInterval(function () {
            for (var i = 0; i < game.BulletArray.length; i++) {
                if(game.status){
                    game.BulletArray[i].BulletFly();
                }
            }
            game.isBoom();
        }, 10)
        enemyAircraftFlyTimer = setInterval(function () {
            for (var i = 0; i < game.enemyArray.length; i++) {
                if(game.status){
                    game.enemyArray[i].enemyAircraftFly();
                }
            }
        }, 10)
        CreateEnemyAircraftTimer = setInterval(function () {
            game.enemyArray.push(new enemyAircraft());
        }, 800);
    },
    "isBoom": function () {
        for (var i = 0; i < this.BulletArray.length; i++) {
            var pos = this.BulletArray[i].isHit();
            if (pos != -1) {
                this.BulletArray[i].BulletDissappear();
                this.enemyArray[pos].Boom();
            }
        }
    },
    "getScore": function (thisScore) {
        this.score += thisScore;
        scoreNum = document.querySelector(".scoreNum");
        scoreNum.innerHTML = this.score;
        if (this.score >= 500) {
            scoreNum.innerHTML = 0;
        }
        if (this.score < 0) {
            game.end();
        }
    },
    "TimeRunning": function () {
        TimeNum = document.querySelector(".TimeNum");
        game.time = 0;
        TimeRunningTimer = setInterval(function () {
            TimeNum.innerHTML++;
            game.time++;
        }, 1000);
    },
    "start": function () {
        btn = document.querySelector(".startBtn");
        mask = document.querySelector(".mask");
        btn.style.display = "none";
        mask.style.display = "none";
        endmask.style.display = "none";
        game.status = 1;
        game.fly();
        game.TimeRunning();
    },
    "Restart":function(){
        meAircraft.CreatemeAircraft();
        game.start();
    },
    "end": function () {
        game.status=0;
        TimeNum.innerHTML = 0;
        scoreNum.innerHTML = 0;
        clearInterval(BulletFlyTimer);
        clearInterval(enemyAircraftFlyTimer);
        clearInterval(CreateEnemyAircraftTimer);
        clearInterval(TimeRunningTimer);
        var enemyAircraft = document.getElementsByClassName("enemyAircraft");
        game.enemyArray = [];
        for (var i = 0, len = enemyAircraft.length; i < len; i++) {
            gameArea.removeChild(enemyAircraft[0]);
        }
        var Bullet = document.getElementsByClassName("Bullet");
        game.BulletArray = [];
        for (var i = 0, len = Bullet.length; i < len; i++) {
            gameArea.removeChild(Bullet[0]);
        }
        rank = document.querySelector(".rank");
        if (game.time <= 30) {
            rank.innerHTML = "倔强青铜";
        }
        if (game.time > 30 && game.time <= 60) {
            rank.innerHTML = "秩序白银";
        }
        if (game.time > 60 && game.time <= 120) {
            rank.innerHTML = "荣耀黄金";
        }
        if (game.time > 120 && game.time <= 240) {
            rank.innerHTML = "尊贵铂金";
        }
        if (game.time > 240 && game.time <= 480) {
            rank.innerHTML = "永恒钻石";
        }
        if (game.time > 480) {
            rank.innerHTML = "最强王者";
        }
        gameArea.removeChild(me);
        endmask.style.display = "block";
        TimeBox = document.querySelector(".TimeBox");
        TimeBox.innerHTML = game.time;
    }

}
var meAircraft = {
    "fly": function (left, top) {
        me = document.querySelector(".meAircraft");
        this.left = left;
        this.top = top;
        if (this.left >= 53 && this.left <= gameAreaWidth - 53) {
            me.style.left = this.left - 53 + "px";
        }
        if (this.top >= 38 && this.top <= gameAreaHeight - 38) {
            me.style.top = this.top - 38 + "px";
        }
    },
    "sendBullet": function (left, top) {
        game.BulletArray.push(new Bullet(left, top));
    },
    "CreatemeAircraft":function(){
        gameArea.appendChild(me);
    }
}
BulletId = 0;
function Bullet(left, top) {
    this.id = "Bullet" + (BulletId++) % 10000;
    this.left = left;
    this.top = top;
    if (this.left <= 53) this.left = 53;
    else if (this.left >= gameAreaWidth - 53) this.left = gameAreaWidth - 53;
    if (this.top <= 0) this.top = 0;
    else if (this.top >= gameAreaHeight - 38) this.top = gameAreaHeight - 38;
    var thisBullet = document.createElement("div");
    thisBullet.className = "Bullet";
    thisBullet.id = this.id;
    thisBullet.style.top = this.top - 38 - 35 + "px";
    thisBullet.style.left = this.left - 3.5 + "px";
    gameArea.appendChild(thisBullet);
}
Bullet.prototype.BulletFly = function () {
    this.top -= 5;
    var thisBullet = document.getElementById(this.id);
    if (this.top >= 0) {
        thisBullet.style.top = this.top - 35 - 38 + "px";
    }
    else {
        this.BulletDissappear();
    }
}
Bullet.prototype.BulletDissappear = function () {
    var thisBullet = document.getElementById(this.id);
    gameArea.removeChild(thisBullet);
    for (var i = 0; i < game.BulletArray.length; i++) {
        if (this == game.BulletArray[i]) {
            game.BulletArray.splice(i, 1);
        }
    }
}
Bullet.prototype.isHit = function () {
    for (var i = 0; i < game.enemyArray.length; i++) {
        var thisEnemyAircraft = document.getElementById(game.enemyArray[i].id);
        var thisEnemyAircraftWidth = thisEnemyAircraft.offsetWidth;
        var thisEnemyAircraftHeight = thisEnemyAircraft.offsetHeight;

        if (this.left - parseInt(thisEnemyAircraft.style.left) >= 0 && this.left - parseInt(thisEnemyAircraft.style.left) <= thisEnemyAircraftWidth
            && this.top - parseInt(thisEnemyAircraft.style.top) >= 0 && this.top - parseInt(thisEnemyAircraft.style.top) <= thisEnemyAircraftHeight) {
            return i;
        }
    }
    return -1;
}
enemyId = 0;
function enemyAircraft() {
    this.id = "enemyAircraft" + (enemyId++) % 10000;
    this.top = 0;
    var thisEnemyAircraft = document.createElement("div");
    thisEnemyAircraft.className = "enemyAircraft " + kind();
    thisEnemyAircraft.id = this.id;
    if (thisEnemyAircraft.className == "enemyAircraft e1") {
        this.score = 10;
    }
    if (thisEnemyAircraft.className == "enemyAircraft e2") {
        this.score = 20;
    }
    if (thisEnemyAircraft.className == "enemyAircraft e3") {
        this.score = 30;
    }
    var m = Math.random() * gameAreaWidth;
    if (m >= gameAreaWidth - 116) {
        m = gameAreaWidth - 116;
    }
    thisEnemyAircraft.style.left = m + "px";
    gameArea.appendChild(thisEnemyAircraft);
}
enemyAircraft.prototype.enemyAircraftFly = function () {
    this.top += 1;
    var thisEnemyAircraft = document.getElementById(this.id);
    if (this.top <= gameAreaHeight) {
        thisEnemyAircraft.style.top = this.top + "px";
    }
    else {
        for (var i = 0; i < game.enemyArray.length; i++) {
            if (game.enemyArray[i] == this) {
                game.enemyArray.splice(i, 1);
            }
        }
        gameArea.removeChild(thisEnemyAircraft);
        game.getScore(this.score * (-5));
    }

}
enemyAircraft.prototype.Boom = function () {
    var thisEnemyAircraft = document.getElementById(this.id);
    thisEnemyAircraft.style.background = "url(./飞机大战下发素材/boom.gif)";
    thisEnemyAircraft.style.backgroundSize = "cover";
    setTimeout(function () {
        gameArea.removeChild(thisEnemyAircraft);
    }, 500)
    for (var i = 0; i < game.enemyArray.length; i++) {
        if (game.enemyArray[i] == this) {
            game.enemyArray.splice(i, 1);
        }
    }
    game.getScore(this.score);
}
function kind() {
    var arr = ["e1", "e2", "e3"];
    var x = Math.floor(Math.random() * 3);
    return arr[x];
}
window.onload = function () {
    endmask = document.querySelector(".endmask");
    endmask.style.display = "none";
    gameArea = document.querySelector(".gameArea");
    gameAreaWidth = gameArea.offsetWidth;
    gameAreaHeight = gameArea.offsetHeight;
    gameArea.onmousemove = function (e) {
        if (game.status) {
            meAircraft.fly(e.offsetX, e.offsetY);
        }
    }
    gameArea.onmousedown = function (e) {
        if (game.status) {
            meAircraft.sendBullet(e.offsetX, e.offsetY);
        }
    }
}