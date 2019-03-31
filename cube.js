

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
    align(){
      if (this.rotX%180===0 && this.rotZ%180===0) {
        return 0;
      }
      else if ((this.rotX%180!==0 && this.rotY%180===0 && this.rotZ%180===0)||
              (this.rotY%180!==0 && this.rotZ%180!==0)) {
      return 1;
      }
      else {
      return 2;
      }
    }
    getNextAlign(rotX,rotY,rotZ){
      if (rotX+this.rotX%180===0 && rotZ+this.rotZ%180===0) {
        return 0;
      }
      else if ((rotX+this.rotX%180!==0 && rotY+this.rotY%180===0 && rotZ+this.rotZ%180===0)||
              (rotY+this.rotY%180!==0 && rotZ+this.rotZ%180!==0)) {
      return 1;
      }
      else if((rotY+this.rotY%180===0 && rotZ+this.rotZ%180!==0)||
              (rotX+this.rotX%180!==0 && rotY+this.rotY%180!==0 && rotZ+this.rotZ%180===0)){
      return 2;
      }
    }

    setPos(){
      this.gravity=0;
      this.isDown=true;
      if (this.align()===0) {
        positions[2.5+this.x][Math.floor(8-this.y)][2.5+this.z]=1;
        positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z]=1;
        positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z]=1;
        this.y=Math.floor(this.y)+0.2;
      }
      else if (this.align()===1) {
        positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z-1]=1;
        positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z]=1;
        positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z+1]=1;
        this.y=Math.floor(this.y)+0.2;
      }
      else {
        positions[2.5+this.x-1][Math.floor(9-this.y)][2.5+this.z]=1;
        positions[2.5+this.x][Math.floor(9-this.y)][2.5+this.z]=1;
        positions[2.5+this.x+1][Math.floor(9-this.y)][2.5+this.z]=1;
        this.y=Math.floor(this.y)+0.2;
      }
    }
    boxCollision(){

    }
    xRotation(dir){
      if (this.align()===0) {
        if(this.z===2.5 && this.getNextAlign(-90,0,0)===1){
          this.z-=1;
          this.rotX+=dir;
        }
        else if(this.z===-2.5 && this.getNextAlign(-90,0,0)===1){
          this.z+=1;
          this.rotX+=dir;
        }
        else if(this.x===2.5 && this.getNextAlign(-90,0,0)===2){
          this.x-=1;
          this.rotX+=dir;
        }
        else if(this.x===-2.5 && this.getNextAlign(-90,0,0)===2){
          this.x+=1;
          this.rotX+=dir;
        }
        else {
          this.rotX+=dir;
        }
      }
      else {
        this.rotX+=dir;
      }
    }

    yRotation(dir){
      if (this.align()===1) {
        if(this.x===2.5 && this.getNextAlign(0,-90,0)===2){
          this.x-=1;
          this.rotY+=dir;
        }
        else if(this.x===-2.5 && this.getNextAlign(0,-90,0)===2){
          this.x+=1;
          this.rotY+=dir;
        }
        else {
          this.rotY+=dir;
        }
      }
      else if (this.align()===2) {
        if(this.z===2.5 && this.getNextAlign(0,-90,0)===1){
          this.z-=1;
          this.rotY+=dir;
        }
        else if(this.z===-2.5 && this.getNextAlign(0,-90,0)===1){
          this.z+=1;
          this.rotY+=dir;
        }
        else {
          this.rotY+=dir;
        }
      }
      else {
        this.rotY+=dir;
      }
    }
    zRotation(dir){
      if (this.align()===0) {
        if(this.z===2.5 && this.getNextAlign(0,0,-90)===1){
          this.z-=1;
          this.rotZ+=dir;
        }
        else if(this.z===-2.5 && this.getNextAlign(0,0,-90)===1){
          this.z+=1;
          this.rotZ+=dir;
        }
        else if(this.x===2.5 && this.getNextAlign(0,0,-90)===2){
          this.x-=1;
          this.rotZ+=dir;
        }
        else if(this.x===-2.5 && this.getNextAlign(0,0,-90)===2){
          this.x+=1;
          this.rotZ+=dir;
        }
        else {
          this.rotZ+=dir;
        }
      }
      else if (this.align()===1) {
        if(this.x===2.5 && this.getNextAlign(0,0,-90)===2){
          this.x-=1;
          this.rotZ+=dir;
        }
        else if(this.x===-2.5 && this.getNextAlign(0,0,-90)===2){
          this.x+=1;
          this.rotZ+=dir;
        }
        else {
          this.rotZ+=dir;
        }
      }
      else if (this.align()===2) {
        if(this.z===2.5 && this.getNextAlign(0,0,-90)===1){
          this.z-=1;
          this.rotZ+=dir;
        }
        else if(this.z===-2.5 && this.getNextAlign(0,0,-90)===1){
          this.z+=1;
          this.rotZ+=dir;
        }
        else {
          this.rotZ+=dir;
        }
      }
      else {
        this.rotZ+=dir;
      }
    }

    move(){
        this.y-=this.gravity;
        this.keyHandlers();
        if (this.align()===0){
          if (positions[2.5+this.x][Math.floor(11-this.y)][2.5+this.z]===1 ||this.y<=-8.9) {
            this.setPos()
          }
        }
        if (this.align()===1){
          if (positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z-1]===1 ||
              positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z]===1 ||
              positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z+1]===1 ||
              this.y<=-9.9) {
            this.setPos()
          }
        }
        if (this.align()===2){
          if (positions[2.5+this.x-1][Math.floor(10-this.y)][2.5+this.z]===1 ||
              positions[2.5+this.x][Math.floor(10-this.y)][2.5+this.z]===1 ||
              positions[2.5+this.x+1][Math.floor(10-this.y)][2.5+this.z]===1 ||
              this.y<=-8.9) {
            this.setPos()
          }
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
                this.xRotation(90);
            }
            else if(eatKey(90)){
                this.xRotation(270);
            }
            else if(eatKey(83)){
                this.yRotation(90);
            }
            else if(eatKey(88)){
                this.yRotation(270);
            }
            else if(eatKey(68)){
                this.zRotation(90);
            }
            else if(eatKey(67)){
                this.zRotation(270);
            }

    }
}
