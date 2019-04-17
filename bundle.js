(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
window.requestAnimFrame = function()
{
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

function get_node_count()
{
    var element = document.getElementsByTagName("BODY")[0];
    const width = +getComputedStyle( element ).getPropertyValue("width").slice(0, -2);
    if ( width < 480 )
        return 70;
    else if ( width < 600 )
        return 80;
    else if ( width < 768 )
        return 100;
    else
        return 200;
}

var node_count = get_node_count();
// console.log( node_count );

var nodes = [];
// const colors = ["#e6e6e6"];
// const colors = ["#d6d6d6"];
const colors = ["#545454"];

const maxVertexAlpha = 0.6;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//Get ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
let scale = window.devicePixelRatio || 1;
// context.scale(scale, scale);
// console.log(scale);

function fix_resolution()
{
    //get CSS size
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let css_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let css_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    //scale the canvas
    canvas.height = css_height * scale;
    canvas.width = css_width * scale;
}

function Node()
{
    this.radius = Math.round(3+Math.random()*3);
    this.x = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) * scale) - this.radius + 1) + this.radius));
    this.y = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("height").slice(0, -2) * scale) - this.radius + 1) + this.radius));
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.speedx = Math.round((Math.random()*201))/100;
    this.speedy = Math.round((Math.random()*201))/100;

    switch ( Math.ceil(Math.random() * 4) )
    {
        case 1:
            this.speedx *= 1;
            this.speedy *= 1;
            break;
        case 2:
            this.speedx *= -1;
            this.speedy *= 1;
            break;
        case 3:
            this.speedx *= 1;
            this.speedy *= -1;
            break;
        case 4:
            this.speedx *= -1;
            this.speedy *= -1;
            break;
    }

    this.move = function()
    {
        context.beginPath();
        context.globalCompositeOperation = 'source-over';
        context.fillStyle   = this.color;
        context.globalAlpha = 1;
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        context.fill();
        context.closePath();

        this.x = this.x + this.speedx;
        this.y = this.y + this.speedy;

        if(this.x <= 0+this.radius)
        {
            this.speedx *= -1;
        }
        if(this.x >= canvas.width-this.radius)
        {
            this.speedx *= -1;
        }
        if(this.y <= 0+this.radius)
        {
            this.speedy *= -1;
        }
        if(this.y >= canvas.height-this.radius)
        {
            this.speedy *= -1;
        }
    };
};

function draw_vertices()
{
    for (var i = 0; i < node_count; i++)
    {
        const node1 = nodes[i];
        for (var j = i+1; j < node_count; j++)
        {
            const node2 = nodes[j];
            const yd = node1.y - node2.y;
            const xd = node1.x - node2.x;
            const d  = Math.sqrt(xd * xd + yd * yd);
            if ( d < 200 )
            {
                context.beginPath();
                context.globalAlpha = (200 - d) / (200 - 0) * maxVertexAlpha;
                context.globalCompositeOperation = 'destination-over';
                context.lineWidth = 1;
                context.moveTo(node1.x, node1.y);
                context.lineTo(node2.x, node2.y);
                context.strokeStyle = this.color;
                context.lineCap = "round";
                context.stroke();
                context.closePath();
            }
        }
    }
}

for (var i = 0; i < node_count; i++)
{
    fix_resolution();
    var node = new Node();
    nodes.push(node);
}

function animate()
{
    fix_resolution();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < node_count; i++)
    {
        nodes[i].move();
    }
    draw_vertices();
    requestAnimFrame(animate);
}

animate();

},{}]},{},[1,2]);
