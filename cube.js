

class Cube {
    constructor(x,y,z){
        this.gravity = 0.02;
        this.isDown = false;
        this.x=x;
        this.y=y;
        this.z=z;

        this.rotX=0;
        this.rotY=0;
        this.rotZ=0;

        this.color = vec4(Math.random(), Math.random(), Math.random(), 1);
    }

    draw(mv){
        gl.bindBuffer( gl.ARRAY_BUFFER, blockBuffer );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );


        var mvTemp = mv;

        gl.uniform4fv( colorLoc, this.color );
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
        if(!this.isDown){
            this.y-=this.gravity
            this.collBottom();
        }
        else {    
                positions[2.5+this.x][Math.floor(8-this.y)][2.5+this.z]=1;
                positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z]=1;
                positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z]=1;
                this.y = Math.floor(this.y);
            }
        }
    


    collBottom() {
        if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z]!==0)
            this.isDown=true;
        else if(this.y < -8.9){
            this.isDown=true;
        } 
    }

    collideX(){

            if(this.x === -2.5){
                if(positions[2.5+this.x+1][Math.floor(11-this.y)][2.5+this.z]===0){
                 return "right";
                }
            }
            else if(this.x === 2.5){
                if(positions[2.5+this.x-1][Math.floor(11-this.y)][2.5+this.z]===0){
                    return "left";
                }
            }
            else if(positions[2.5+this.x-1][Math.floor(11-this.y)][2.5+this.z]===0
                 && positions[2.5+this.x+1][Math.floor(11-this.y)][2.5+this.z]!==0){
                    return "left";
                }
            else if(positions[2.5+this.x+1][Math.floor(11-this.y)][2.5+this.z]===0
                 && positions[2.5+this.x-1][Math.floor(11-this.y)][2.5+this.z]!==0){
                    return "right";
                } 
            else if(positions[2.5+this.x+1][Math.floor(11-this.y)][2.5+this.z]!==0
                && positions[2.5+this.x-1][Math.floor(11-this.y)][2.5+this.z]!==0) {
                    return "none";
                }    
            else return "both";    

        
    }

    
    collideZ(){

        if(this.z === -2.5){
            if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z+1]===0){
             return "back";
            }
        }
        else if(this.z === 2.5){
            if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z-1]===0){
                return "front";
            }
        }
        else if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z-1]===0
             && positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z+1]!==0){
                return "front";
            }
        else if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z+1]===0
             && positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z-1]!==0){
                return "back";
            } 
        else if(positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z+1]!==0
            && positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z-1]!==0) {
                return "none";
            }    
        else return "both";    

    
}


    keyHandlers(){
        if(!this.isDown)
            if(eatKey(37) && (this.collideX() === "left" || this.collideX() === "both")){
                this.x-=1;
            }
            else if(eatKey(39) && (this.collideX() === "right" || this.collideX() === "both")){
                this.x+=1;
            }
            else if(eatKey(40) && (this.collideZ() === "back" || this.collideZ() === "both")){
                this.z+=1;
            }
            else if(eatKey(38) && (this.collideZ() === "front" || this.collideZ() === "both")){
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
