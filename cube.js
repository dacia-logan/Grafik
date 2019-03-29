
var gravity = 0.0;

class Cube {
    constructor(x,y,z){
        this.isDown = false;
        this.x=x;
        this.y=y;
        this.z=z;

        this.rotX=0;
        this.rotY=0;
        this.rotZ=0;

    }

    draw(mv){
        gl.bindBuffer( gl.ARRAY_BUFFER, blockBuffer );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

        
        var mvTemp = mv;

        gl.uniform4fv( colorLoc, vec4(1.0, 0, 0.0, 1.0) );
        mvTemp = mult( mvTemp, translate(this.x, this.y,this.z));
        mvTemp = mult( mvTemp, rotateY( this.rotY ));
        mvTemp = mult( mvTemp, rotateX( this.rotX ));
        mvTemp = mult( mvTemp, rotateZ( this.rotZ ));
        mvTemp = mult( mvTemp, scalem(1.0, 3.0, 1.0));
        

        gl.uniformMatrix4fv(matrixLoc, false, flatten(mvTemp));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 0, 1.0, 1.0) );
        
/*
        var mv1 = mat4();

        mv1 = mult( mvTemp, translate(this.x, this.y+1, this.z));
        mv1 = mult( mv2, rotateY( this.rotY ));
        mv1 = mult( mv1, rotateX( this.rotX ));
        mv1 = mult( mv1, rotateZ( this.rotZ ));
        mv1 = mult( mv1, translate(this.x-this.x, this.y-this.y+1, this.z-this.z));


        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);

        gl.uniform4fv( colorLoc, vec4(0.0, 1.0, 0.0, 1.0) );


        var mv3 = mat4();
        mv3 = mult( mvTemp, translate(this.x, this.y-1, this.z));
        mv3 = mult( mv2, rotateY( this.rotY ));
        mv3 = mult( mv3, rotateX( this.rotX ));
        mv3 = mult( mv3, rotateZ( this.rotZ ));
        mv3 = mult( mv3, translate(this.x-this.x, this.y-this.y-1, this.z-this.z));
        gl.uniformMatrix4fv(matrixLoc, false, flatten(mv3));
        gl.drawArrays( gl.TRIANGLES, 0,  NumVertices);
        
*/
    }



    move(){
        this.keyHandlers();
        if(this.y > -8.9)
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
            else if(eatKey(65)){
                this.rotX+=90;
            }
            else if(eatKey(90)){
                this.rotX-=90;
            }
            else if(eatKey(83)){
                this.rotY+=90;
            }
            else if(eatKey(88)){
                this.rotY-=90;   
            }
            else if(eatKey(68)){
                this.rotZ+=90;
            }
            else if(eatKey(67)){
                this.rotZ-=90;
            }
           
    }
}
