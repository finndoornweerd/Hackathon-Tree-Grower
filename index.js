


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//location of tree on screen shited
treeShift = 100;


//creates background and truck during ball animation
function background(){
    var grd = ctx.createLinearGradient(canvas.width/2, 0, canvas.width/2, canvas.height);
    grd.addColorStop(0, "#87cefa");
    grd.addColorStop(1, "#1a95e2")
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function trunk(){
    ctx.strokeStyle = 'rgb(150,75,0)';
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2-treeShift,canvas.height);
    ctx.lineTo(canvas.width/2-treeShift,canvas.height-150);
    ctx.stroke();
    ctx.closePath();
}


//Creates fractal tree with given input
var Tree;
class Fractal{
    constructor(x,y,length,lineWidth,angle,times,decreaseWidth,decreaseLength,degree,lenthDecrease,widthDecrease,timeInt){
        this.lenthDecrease = lenthDecrease;
        this.widthDecrease = widthDecrease;
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
        this.times = times;
        this.decreaseLength = decreaseLength;
        this.decreaseWidth = decreaseWidth;
        this.degree = degree;
        this.lineWidth = lineWidth;
        this.color = [150,75,0];
        this.timeInt = timeInt;
        this.drawLine(this.x,this.y,this.length,this.lineWidth,this.angle,this.times,this.lenthDecrease,this.widthDecrease,this.color);
    }

//Draws new branches recursively
    drawLine(x,y,length,lineWidth,newAngle,times,lenthDecrease,widthDecrease,color){
        if(times>0){
            var angle;
            if(newAngle <= 0){
                angle = newAngle+360;
            }
            else if(newAngle > 360){
                angle = newAngle-360;
            }
            else{
                angle = newAngle;
            }

            var cords = this.getCords(length,angle);
 
            ctx.strokeStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+cords[0],y+cords[1]);
            ctx.stroke();
            ctx.closePath();


            color[0] = color[0]-0.01;
            if(color[1] < 200){
                color[1] = color[1]+0.1;
            }

            

            if(lenthDecrease){
                var newLength = length*this.decreaseLength;
            }
            else{
                var newLength = length;
            }
            if(widthDecrease){
                var newLineWidth = lineWidth*this.decreaseWidth ;
            }
            else{
                var newLineWidth = lineWidth;
            }

            var newX = x+cords[0];
            var newY = y+cords[1];
            var degree = this.degree;
            
            
            if(this.timeInt.length > this.times - times){
                var wait = this.timeInt[this.times-times];
            }
            else{
                var wait = 500;
            }

            times--;

            setTimeout(function(){
                Tree.drawLine(newX,newY,newLength,newLineWidth,angle+degree,times,lenthDecrease,widthDecrease,color);
                Tree.drawLine(newX,newY,newLength,newLineWidth,angle-degree,times,lenthDecrease,widthDecrease,color);
            },wait);
            

        }
        else{
            giveInfo();
        }
    }

//Get position for ending point of the branches
    getCords(length,angle){
        if(angle == 360){
            return [0,length];
        }
        if(angle > 0 && angle < 90){
            var x =Math.sin(angle*Math.PI/180)*length*-1;
            var y = Math.cos(angle*Math.PI/180)*length;
            return[x,y];
        }
        if(angle == 90){
            return [length*-1,0];
        }
        if(angle > 90 && angle < 180){
            var x = Math.cos((angle-90)*Math.PI/180)*length*-1;
            var y = Math.sin((angle-90)*Math.PI/180)*length*-1;
            return[x,y]
        }
        if(angle == 180){
            return [0,-1*length];
        }
        if(angle > 180 && angle < 270){
            var x = Math.sin((angle-180)*Math.PI/180)*length;
            var y = Math.cos((angle-180)*Math.PI/180)*length*-1;
            return[x,y];
        }
        if(angle == 270){
            return [length,0];
        }
        if(angle > 270 && angle < 360){
            var x = Math.cos((angle-270)*Math.PI/180)*length;
            var y = Math.sin((angle-270)*Math.PI/180)*length;
            return[x,y]
        }
    }
}


//Particles for explosion transition
particles = [];

class Particles{
    constructor(x,y,color,xv,yv){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 50;
        this.xv = xv;
        this.yv = yv;
        this.gravity = 5/60;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    fall(){
        this.yv+= this.gravity;
        this.x+=this.xv;
        this.y+=this.yv;
    }

    update(){
        this.draw();
        this.fall();

    }
}

//Creates particles that explode in every direction
function explode(){  

    for(var i=0; i<1000; i++){
        var r = Math.random()*255;
        var g = Math.random()*255;
        var b = Math.random()*255;

        var speed = 8;
        var v = Math.random()*speed;
        
            if(i>500 && i<980){
                 var xv = (Math.random()*(speed)*2)-speed;
                if(Math.random() > 0.5){
                    var yv = Math.sqrt(Math.pow(v,2)-Math.pow(xv,2));
                }
                else{
                    var yv = -1*Math.sqrt(Math.pow(v,2)-Math.pow(xv,2));
                }
            }
            if(i<500){
                var yv = (Math.random()*(speed)*2)-speed;
                if(Math.random() > 0.5){
                    var xv = Math.sqrt(Math.pow(v,2)-Math.pow(yv,2));
                }
                else{
                    var xv = -1*Math.sqrt(Math.pow(v,2)-Math.pow(yv,2));
                }
            }
            

           //Guarantees tree trunk cover to appear so shoot down at it
            if(i>980 && i<1000){
                var yv = (Math.random()*(speed/2)*2);
                var xv = Math.random()*-2
            }

                
        var randNum = 100;
        var randX = (Math.random()*randNum)+(canvas.width)/2-randNum;
        var randY = (Math.random()*randNum)+(canvas.height)/2-randNum;
        particles.push(new Particles(randX,randY,'rgb('+r+','+g+','+b+')',xv,yv));
    }
}

//Animates the particles until they are all below the height of screen
var animate;
var makeTrunk = false;
function update(){
    animate = requestAnimationFrame(update);

    background();
    if(makeTrunk){
        trunk();
    }
    
    for(var i in particles){
        particles[i].update();
    }
}

//Remove question box and begin tree creation and explosion
function init(inters,angle){


    explode();
    update();

    //timer until tree appears on screen to make it magically appear
    setTimeout(function(){
        makeTrunk = true;
    },1000);

    //timer until tree begins growing
    setTimeout(function(){
        cancelAnimationFrame(animate);
        createTree(inters,angle);

    },5000);

    document.getElementById("userinput").remove();
}

//Initialize tree object
function createTree(inters,angle){
    angle = angle;
    treeTime = [1,1500,1000,800,700,600];
    iterations = inters;
    
    Tree = new Fractal((canvas.width)/2-treeShift,canvas.height,150,40,180,iterations,0.7,0.83,angle,true,true,treeTime);
}







//Score algorithm to determine how many branches and angle of branches the tree has
var runs;
function getScore(){
    var score = 0;

    if(!electric){
        score += (drive/mpg)*100;
    }

    if(electric){
        score += drive*10;
    }

    if(meat){
        score += 30;
    }

    score += shower*2;

    score += plastic*7;



    var j=12
    for(var i=58; i<=701; i+=58){
        if(score<i && score>=i-58)
            runs=j;
        else if(score>701)
            runs=2;
    
        j--;
    }

    
    if(runs <= 5){
        var angle = 55;

    }
    if(runs > 5 && runs <=7 ){
        var angle = 45;
    }
    else{
        var angle = 30;
    }

    init(runs,angle);
}


var drive; 
var mpg;
var electric = true;
var meat;
var shower;
var plastic;


var name;
var warn = false;
var state = 'nameQ';



//Asks all the questions and stores answer for later use
function switchState(){

    switch(state){
        case 'nameQ':
            document.getElementById("question").innerHTML = "What is your name?";
            state = 'nameA';
            break

        case 'nameA':
            name = document.getElementById("answer").value;
            document.getElementById("form").reset()

            state = 'carQ';
            switchState();
            break

        case 'carQ':
            document.getElementById("question").innerHTML = "About how many minutes did you drive today "+name+"?";
            state = 'carA';
            break

        case 'carA':
            drive = Number(document.getElementById("answer").value);
            document.getElementById("form").reset()

            if(!isNaN(drive) && drive>0){
                warn = false;
                state = 'carTypeQ';
                switchState();
                break
            }
            if(!isNaN(drive) && drive == 0){
                warn = false;
                state = 'meatQ';
                switchState();
                break
            }
            else{
                if(!warn){
                    document.getElementById("question").innerHTML+="\n(Type a numerical value)";
                    warn = true;
                }
            }
            break

        case 'carTypeQ':
            document.getElementById("question").innerHTML = "Did you drive an electric car  "+name+"?";
            state= 'carTypeA';
            break

        case 'carTypeA':
            ans = document.getElementById("answer").value.toLowerCase();
            document.getElementById("form").reset()
            if(ans == 'yes'){
                electric = true
                warn = false;
                state = 'meatQ';
                switchState();
                break
            }
            if(ans == 'no'){
                electric = false;
                warn = false;
                state = 'mpgQ';
                switchState();
                break
            }
            else{
                if(!warn){
                    warn = true;
                    document.getElementById("question").innerHTML+="\n(Type 'yes' or 'no')";
                }
            }
            break


        case 'mpgQ':
            document.getElementById("question").innerHTML = "What is the mpg of your car "+name+"?";
            state = 'mpgA';
            break
        
        case 'mpgA':
            mpg = Number(document.getElementById("answer").value);
            document.getElementById("form").reset()
            if(!isNaN(mpg)){
                warn = false;
                state = 'meatQ';
                switchState();
                break
            }
            else{
                if(!warn){
                    document.getElementById("question").innerHTML+="\n(Type a numerical value)";
                    warn = true;
                }
            }
            break

        case 'meatQ':
            document.getElementById("question").innerHTML = "Did you eat meat today "+name+"?";
            state = 'meatA';
            break;
        
        case 'meatA':
            meat = document.getElementById("answer").value.toLowerCase();
            document.getElementById("form").reset()

            if(meat == 'yes'){
                meat = true;
                warn = false;
                state = 'showerQ';
                switchState();
                break
            }
            if(meat == 'no'){
                meat = false;
                warn = false;
                state = 'showerQ';
                switchState();
                break
            }
            else{
                if(!warn){
                    warn = true;
                    document.getElementById("question").innerHTML+="\n(Type 'yes' or 'no)";
                }
            }
            break

        case 'showerQ':
            document.getElementById("question").innerHTML = "How many minutes did you shower today "+name+"?";
            state = 'showerA';
            break
            
        case 'showerA':
            shower = Number(document.getElementById("answer").value);
            document.getElementById("form").reset()
            if(!isNaN(shower)){
                warn = false;
                state = 'plasticQ';
                switchState();
                break
            }
            else{
                if(!warn){
                    document.getElementById("question").innerHTML+="\n(Type a numerical value)";
                    warn = true;
                }
            }
            break

        case 'plasticQ':
            document.getElementById("question").innerHTML = "How many plastic items have you discaded today "+name+"?";
            state = 'plasticA';
            break
            
        case 'plasticA':
            plastic = Number(document.getElementById("answer").value);
            document.getElementById("form").reset()
            if(!isNaN(plastic)){
                warn = false;
                state = 'tree';
                switchState();
                break
            }
            else{
                if(!warn){
                    document.getElementById("question").innerHTML+="\n(Type a numerical value)";
                    warn = true;
                }
            }
            break

        case 'tree':
            getScore();
            break;
        
    }


}


//Gives information on how good  the person's sustainability practices were that day
//Also gives information on how to improve
function giveInfo(){
    ctx.font = '30px Andale Mono, monospace';
    ctx.fillStyle = "black";

    if(runs<=2){
        ctx.fillText('Your tree is well below average.', 20, 50);


    }
    else if(runs>2&&runs<=6){
        ctx.fillText('Your tree is below average.', 20, 50);
    }
    else if(runs == 8 ||runs==7){
        ctx.fillText('Your tree is average.', 20, 50);
    }
    else if(runs>7&&runs<=9){
        ctx.fillText('Your tree is above average!', 20, 50);
    }
    else{
        ctx.fillText('Your tree is great! Keep it up!', 20, 50);
    }


    ctx.font = '30px Andale Mono, monospace';
    ctx.fillText('A few things to help improve your tree:', canvas.width-750,50);

    var suggestions = [];
    if(plastic>1){
        suggestions.push('-Use less plastic');
    }
    if(electric==false){
        suggestions.push('-Use electric car');
    }
    if(mpg<=25){
        suggestions.push('-Use a more fuel');
        suggestions.push(' effecient car');
        suggestions.push('-Carpool with a friend');

    }
    if(drive>=30){
        suggestions.push('-Shorten your commute');
        suggestions.push(' time');
        suggestions.push('-Use public');
        suggestions.push(' transportation');
    }
    if(meat==true){
        suggestions.push('-Consume a more');
        suggestions.push(' sustainable diet');
    }
    if(shower>=20){
        suggestions.push('-Shorten your showers');
    }


    ctx.font = '25px Andale Mono, monospace';
    for(var i=0; i<suggestions.length; i++){
        ctx.fillText(suggestions[i], canvas.width-335, 33*i+110);
    }

    
    

}

//Begin at first state/question
switchState();
