var GAMEWIDTH = 512;
var GAMEHEIGHT = 512;

// STATES
var INITSTATE = 0; // checks whether a game file exists in localstorage + other stuff
var MENUSTATE = 1;
var ROUNDLOADSTATE = 2;
var GAMESTATE = 3;
var GAMEOVERSTATE = 4;


// KEY INFORMATION
var KEYDOWN = 0;
var KEYUP = 1; // this is an event on keyup, should change to KEYSTATIC after event is handled
var KEYSTATIC = 2;

var SHIFT = 16;
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;
var X = 88;
var Z = 90;
var A = 65;
var M = 77;
var W = 87;
var D = 68;
var S = 83;


// COLLISION TYPES
var CIRCLE = 0;
var RECTANGLE = 1;

// ENTITY TYPES
var SPAWNABLE = 0;
var BULLET = 1;
var WALL = 2;
var PLAYER = 3;
var GAMEITEM = 4;

// SPAWNABLE TYPES
var LITTLESUSIE = 0;
var BIGBEAR = 1;
var STAIRS = 2;

// GAMEITEMS
var AMMO = 0;
var KEY = 1;


