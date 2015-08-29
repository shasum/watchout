// start slingin' some d3 here.

var gameOptions = {
  enemyCount : 15
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var updateScore = function() {
  d3.select('.current').select('span').text(gameStats.score.toString());
};

updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select('.high').select('span').text(gameStats.bestScore.toString());
};

updateCollisions = function() {
  gameStats.collisions++;
  d3.select('.collisions').select('span').text(gameStats.collisions.toString());
};

var createEnemies = function() {
  var enemiesArray =[];
  for (var i = 0; i < gameOptions.enemyCount; i++) {
    enemiesArray.push({ id : i, x: Math.random() * window.innerWidth, y : Math.random() * 500, r : 10, width: 20, height: 20, color : 'blue' });
  }
  return enemiesArray;
};


var svgContainer = d3.select("body").append("svg").attr("width", '100%').attr("height", 500);


var drawEnemies = function(enemiesArray) {
  var enemies = svgContainer.selectAll('.enemy').data(enemiesArray).enter().append('rect');
  enemies.attr("x", function (d) { return d.x; });
  enemies.attr("y", function (d) { return d.y; });
  enemies.attr("r", function (d) { return d.r; });
  enemies.attr('width', function (d) { return d.width; });
  enemies.attr('height', function (d) { return d.height; });
  enemies.style("fill", function(d) { return d.color; });
  enemies.attr("class", "enemy");
  enemies.style("animation-iteration-count", 'infinite');
  enemies.style("animation-duration", '.5s');
  enemies.style("animation-name", 'spin');
  enemies.style("animation-timing-function", 'linear');
  enemies.style("transform-origin", 'center');
  enemies.attr('recentlyCollided', false);
  //enemies.attr("background", url(assets/asteroid.png));
};


var player;

var createPlayer = function() {
 player = { x : window.innerWidth / 2,  y : 250, r : 10, color : 'red'};
 return [player];
};

var drag = d3.behavior.drag()
 .on('dragstart', function() { d3.select(this).style('fill', 'yellow'); })
 .on('drag', function() { d3.select(this)
                          .attr('cx', d3.event.x)
                          .attr('cy', d3.event.y);
                          player.x = d3.event.x;
                          player.y = d3.event.y;})
 .on('dragend', function() { d3.select(this).style('fill', 'red'); });



var drawPlayer = function() {
  var player = svgContainer.selectAll('.player').data(createPlayer()).enter().append('circle');
  player.attr("cx", function (d) { return d.x; });
  player.attr("cy", function (d) { return d.y; });
  player.attr("r", function (d) { return d.r; });
  player.style("fill", function(d) { return d.color; });
  player.attr("class", "player");
  player.call(drag);
};


var buildGame = function() {
  var enemies = [];
  enemies = createEnemies();
  drawEnemies(enemies);
  setInterval(moveEnemies, 2000);
  setInterval(function() {
    gameStats.score++;
    updateScore();
  }, 50);
  drawPlayer();
};
/*
var enemyPositions = function(){
  var enemiesArray =[];
  for (var i = 0; i < gameOptions.enemyCount; i++) {
    enemiesArray.push({ x: Math.random() * 100, y : Math.random() * 100});
  }
  return enemiesArray;
};
*/
//var recentlyCollided = false;

var checkCollision = function(enemy, collidedCallback) {
  var collided = false;
  var radiusSum, separation, xDiff, yDiff;
  radiusSum = parseFloat(enemy.attr('r')) + player.r;
  xDiff = parseFloat(enemy.attr('x')) - player.x;
  yDiff = parseFloat(enemy.attr('y')) - player.y;
  separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  if (separation < radiusSum) {
    collided = true;
    if (enemy.attr('recentlyCollided') !== collided.toString()) {
      collidedCallback(player, enemy);
    }
  }
  enemy.attr('recentlyCollided', collided.toString());
};

var onCollision = function() {
  updateBestScore();
  updateCollisions();
  gameStats.score = 0;
  updateScore();
  var player = d3.select('.player');
  player.style('fill', 'pink');
  setTimeout(function () { d3.select('.player').style('fill', 'red');}, 500);
  player.style("animation-name", 'oscillate');
  player.style("animation-duration", '0.2s');
  player.style("animation-iteration-count", 'infinite');
  player.style('animation-timing-function', 'linear');
  player.style("animation-play-state", 'running');
  setTimeout(function() {
    player.style("animation-play-state", 'paused');
  },200);
};

var collisionFactory = function(){
  var enemy = d3.select(this);

  var startPos = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
  };

  var endPos = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * 500
  };

  return function(t) {
    var enemyNextPos;
    checkCollision(enemy, onCollision);
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    enemy.attr('x', enemyNextPos.x).attr('y', enemyNextPos.y);
  };

};

var moveEnemies = function() {
  var enemiesData = createEnemies();
  var enemies = svgContainer.selectAll('.enemy');
  enemies.transition().duration(2000).tween('custom', collisionFactory);

  // .attr("cx", function(d) {
  //   return Math.random() * window.innerWidth; // Is this a good way to reference
  // })
  // .attr("cy", function(d) {                // game container's width?
  //   return Math.random() * 500;
  // });
};

buildGame();



