/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Vörpunarfylki búið til í JS og sent yfir til
//     hnútalitara, sem margfaldar (þ.e. varpar)
//
//    Hjálmtýr Hafsteinsson, febrúar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 36;

var fieldPoints = [];
var blocks = [];

var colors = [];
var s = [];

var fieldBuffer;
var blockBuffer;

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var setAlign = false;
var colorLoc;
var matrixLoc;
var vPosition;
var spawnPoints=[];
for (var i = -2.5; i <= 2.5; i+=1) {
  for (var y = -2.5; y <= 2.5; y+=1) {
    spawnPoints.push([i,y])
  }
}


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    fieldBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, fieldBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(fieldPoints), gl.STATIC_DRAW );

    blockBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, blockBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(blocks), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "mv" );
    colorLoc = gl.getUniformLocation( program, "color" );

    pLoc = gl.getUniformLocation( program, "projection" );
    var proj = ortho( -0.8, 0.8, -1.2, 1.2, -2.0, 2.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );



    render();
}



function colorCube()
{

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

}

function quad(a, b, c, d)
{

    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];


    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        fieldPoints.push( vertices[indices[i]] );
        blocks.push( vertices[indices[i]] );
    }
}


var cubes = [];

var spawnPoints=[];
for (var i = -2.5; i <= 2.5; i+=1) {
  for (var y = -2.5; y <= 2.5; y+=1) {
    spawnPoints.push([i,y])
  }
}

function drawCubes(mv){
    if(cubes.length === 0 || cubes[cubes.length-1].isDown){
        var points = spawnPoints[Math.floor(Math.random()*36)];
        cubes[cubes.length] = new Cube(points[0], 9, points[1]);
    }

    for(var i = 0; i<cubes.length; i++){
        cubes[i].move();
        cubes[i].draw(mv);
        

    }

}




function field(mv){

    gl.bindBuffer( gl.ARRAY_BUFFER, fieldBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniform4fv( colorLoc, vec4(0.0, 0.0, 0.0, 1.0) );

    var mvTemp = mult(mv, scalem(0.5,0.5,0.5));

    var mv1 = mat4();
    mv1 = mult( mvTemp, translate(0.0, 20.5, 6.5));
    mv1 = mult( mv1, scalem(14, 1, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv2 = mat4();
    mv2 = mult( mvTemp, translate(0.0, 20.5, -6.5));
    mv2 = mult( mv2, scalem(14, 1, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv2));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv3 = mat4();
    mv3 = mult( mvTemp, translate(-6.5, 20.5, 0.0));
    mv3 = mult( mv3, scalem(1, 1, 14));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv3));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv4 = mat4();
    mv4 = mult( mvTemp, translate(6.5, 20.5, 0.0));
    mv4 = mult( mv4, scalem(1, 1, 14));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv4));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv5 = mat4();
    mv5 = mult( mvTemp, translate(0.0, -20.5, -6.5));
    mv5 = mult( mv5, scalem(14, 1, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv5));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv6 = mat4();
    mv6 = mult( mvTemp, translate(0.0, -20.5, 6.5));
    mv6 = mult( mv6, scalem(14, 1, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv6));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv7 = mat4();
    mv7 = mult( mvTemp, translate(6.5, -20.5, 0.0));
    mv7 = mult( mv7, scalem(1, 1, 14));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv7));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv8 = mat4();
    mv8 = mult( mvTemp, translate(-6.5, -20.5, 0.0));
    mv8 = mult( mv8, scalem(1, 1, 14));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv8));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);


    var mv9 = mat4();
    mv9 = mult( mvTemp, translate(6.5, 0.0, 6.5));
    mv9 = mult( mv9, scalem(1, 40, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv9));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv10 = mat4();
    mv10 = mult( mvTemp, translate(6.5, 0.0, -6.5));
    mv10 = mult( mv10, scalem(1, 40, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv10));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv11 = mat4();
    mv11 = mult( mvTemp, translate(-6.5, 0.0, -6.5));
    mv11 = mult( mv11, scalem(1, 40, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv11));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    var mv12 = mat4();
    mv12 = mult( mvTemp, translate(-6.5, 0.0, 6.5));
    mv12 = mult( mv12, scalem(1, 40, 1));
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv12));
    gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

}





function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = mat4();


    mv = mult(mv, scalem(0.1,0.1,0.1));
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );


    field(mv);
    drawCubes(mv);


    requestAnimFrame( render );
}
