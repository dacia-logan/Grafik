
var gravity = 0.01;

class Cube {
    constructor(x,y,z){
        this.isDown = false;
        this.x=x;
        this.y=y;
        this.z=z;
        this.rot=0;
    }

    draw(mv){
        gl.bindBuffer( gl.ARRAY_BUFFER, blockBuffer );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

        this.rot+=2;
        var mvTemp = mv;

        gl.uniform4fv( colorLoc, vec4(1.0, 0, 0.0, 1.0) );



        var mv2 = mat4();
        mv2 = mult( mvTemp, translate(this.x, this.y, this.z));
        mv2=mult(mv2,rotateZ(this.rot))
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv2));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 0, 1.0, 1.0) );


        var mv1 = mat4();
        mv1 = mult( mvTemp, translate(this.x, this.y+1, this.z));
        mv1= mult(mv2,rotateZ(this.rot));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 1.0, 0.0, 1.0) );


        var mv3 = mat4();
        mv3= mult(mv3, rotateZ(this.rot))
        mv3 = mult( mvTemp, translate(this.x, this.y-1, this.z));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv3));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

    }



    move(){
        this.keyHandlers();

        if(this.y-2 > -9.98)
            this.y -= gravity;
        else this.isDown = true;
    }


    keyHandlers(){
        if(!this.isDown)
            if(eatKey(37) && this.x > -2){
                this.x-=1;
            }
            else if(eatKey(39) && this.x < 2){
                this.x+=1;
            }
            else if(eatKey(40) && this.z < 2){
                this.z+=1;
            }
            else if(eatKey(38) && this.z > -2){
                this.z-=1;
            }
    }
}
