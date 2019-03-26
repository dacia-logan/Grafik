
class Cube {
    constructor(){
        this.isDown = false;
        this.spawnPoints = [];
    }

    draw(mv){
        gl.bindBuffer( gl.ARRAY_BUFFER, blockBuffer );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

  
        var mvTemp = mv;

        gl.uniform4fv( colorLoc, vec4(1.0, 0, 0.0, 1.0) );

        var mv1 = mat4();
        mv1 = mult( mvTemp, translate(0.0, 0.0, 0.0));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 1.0, 0.0, 1.0) );

        var mv2 = mat4();
        mv2 = mult( mvTemp, translate(0.0, 1.0, 0.0));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv2));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 0, 1.0, 1.0) );

        var mv3 = mat4();
        mv3 = mult( mvTemp, translate(0.0, 2.0, 0.0));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv3));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    }

    collision(){

    }

    move(){
        
    }
}

