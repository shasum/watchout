// start slingin' some d3 here.

var gameOptions = {
  enemyCount : 5
};

var createEnemies = function() {
  var enemiesArray =[];
  for (var i = 0; i < gameOptions.enemyCount; i++) {
    enemiesArray.push({ id : i, x: Math.random() * 100, y : Math.random() * 100, r : 5, color : 'blue' });
  }
  return enemiesArray;
};


var svgContainer = d3.select("body").append("svg").attr("width", '100%').attr("height", 500);



var drawEnemies = function(enemiesArray) {
  var enemies = svgContainer.selectAll('circle').data(enemiesArray).enter().append('circle');
  enemies.attr("cx", function (d) { return d.x; });
  enemies.attr("cy", function (d) { return d.y; });
  enemies.attr("r", function (d) { return d.r; });
  enemies.style("fill", function(d) { return d.color; });
};

var buildGame = function() {
  var enemies = [];
  enemies = createEnemies();
  drawEnemies(enemies);
};

buildGame();