// start slingin' some d3 here.

var gameOptions = {
  enemyCount : 5
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var updateScore = function() {
  return d3.select('.current').text(gameStats.score.toString());
};

updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  return d3.select('.high').text(gameStats.bestScore.toString());
};

var createEnemies = function() {
  var enemiesArray =[];
  for (var i = 0; i < gameOptions.enemyCount; i++) {
    enemiesArray.push({ id : i, x: Math.random() * window.innerWidth, y : Math.random() * 500, r : 5, color : 'blue' });
  }
  return enemiesArray;
};


var svgContainer = d3.select("body").append("svg").attr("width", '100%').attr("height", 500);



var drawEnemies = function(enemiesArray) {
  var enemies = svgContainer.selectAll('.enemy').data(enemiesArray).enter().append('circle');
  enemies.attr("cx", function (d) { return d.x; });
  enemies.attr("cy", function (d) { return d.y; });
  enemies.attr("r", function (d) { return d.r; });
  enemies.style("fill", function(d) { return d.color; });
  enemies.attr("class", "enemy");
};


var player;

var createPlayer = function() {
 player = { x : window.innerWidth / 2,  y : 250, r : 5, color : 'red'};
 return [player];
};

var drag = d3.behavior.drag()
 .on('dragstart', function() { d3.select(this).style('fill', 'black'); })
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
  setInterval(moveEnemies, 1000);
  setInterval(function(){
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
var checkCollision = function(enemy, collidedCallback) {

  var radiusSum, separation, xDiff, yDiff;
  radiusSum = parseFloat(enemy.attr('r')) + player.r;
  xDiff = parseFloat(enemy.attr('cx')) - player.x;
  yDiff = parseFloat(enemy.attr('cy')) - player.y;
  separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  if (separation < radiusSum) return collidedCallback(player, enemy);

};

var onCollision = function() {
  updateBestScore();
  gameStats.score = 0;
  return updateScore();
};

var collisionFactory = function(){
  var enemy = d3.select(this);

  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
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
    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };

};

var moveEnemies = function() {
  var enemiesData = createEnemies();
  var enemies = svgContainer.selectAll('.enemy');

  enemies.transition().tween('custom', collisionFactory);

  // .attr("cx", function(d) {
  //   return Math.random() * window.innerWidth; // Is this a good way to reference
  // })
  // .attr("cy", function(d) {                // game container's width?
  //   return Math.random() * 500;
  // });
};

buildGame();