import './style/index.less'
//定义食物类
class Food{
    //定义一个属性表示食物对应的元素
    element:HTMLElement;
    constructor(){
        this.element = document.getElementById('food')!
    }
    //定义一个方法获取食物x的坐标，和y坐标的方法
    get X(){
        return this.element.offsetLeft;
    }
    get Y(){
        return this.element.offsetTop;
    }
    change(){
        //食物的分布必须是在10的整数倍的格子上，不然蛇会吃不到食物
        let top = Math.round(Math.random()*29)*10
        let left = Math.round(Math.random()*29)*10
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }
}
//记分牌
class ScorePanel{
    score = 0;
    level = 0;
    scoreEle:HTMLElement;
    levelEle:HTMLElement;
    maxLevel:number;
    upScore:number;
    constructor(maxLevel:number = 10, upScore:number = 10){
        this.scoreEle = document.getElementById('score')!;
        this.levelEle = document.getElementById('level')!;
        this.maxLevel = maxLevel;
        this.upScore = upScore;
    }
    scoreUp (){
        this.scoreEle.innerHTML = ++this.score + '';
        if ((this.score-1) % this.upScore === 0){
            this.levelUp();
            
        }
    }
    levelUp (){
        if (this.level < this.maxLevel){
            this.levelEle.innerHTML = ++this.level + '';
        }
        
    }
}
// const food = new Food()
// food.change()
// console.log(food.X, food.Y);

// const score = new ScorePanel()

class Snake{
    head:HTMLElement;
    body:HTMLCollection;
    element:HTMLElement;
    constructor(){
        this.element = document.getElementById('snake')!;
        this.head = document.querySelector('#snake > div')!;
        this.body = this.element.getElementsByTagName('div');
    }
    get X(){
        return this.head.offsetLeft;
    }
    get Y(){
        return this.head.offsetTop;
    }
    set X(value:number){
        //因为每次的方向改变只能是一个方向，所以判断一下是哪个方向提高一下效率
        if (this.X === value){
            return;
        }
        if(value < 0 || value> 290){
            throw new Error('Game Over!')
        }
        if (this.body[1]&&(this.body[1] as HTMLElement).offsetLeft === value){
            //判断蛇时候有第二节，如果有当第二节的位置和蛇头的位置重合时则说明在向反方向移动
            if(value > this.X){
                //如果value 》x则代表蛇发生向右掉头，这时应该让蛇继续向左走
                value = this.X - 10;
            }else{
                value = this.X + 10;
            }
        }
        this.moveBody();
        this.head.style.left = value + 'px';
        this.checkOverlap()
    }
    set Y(value:number){
        if (this.Y === value){
            return;
        }
        if(value < 0 || value> 290){
            throw new Error('Game Over!')
        }
        if (this.body[1]&&(this.body[1] as HTMLElement).offsetTop === value){
            
            if(value > this.Y){
              
                value = this.Y - 10;
            }else{
                value = this.Y + 10;
            }
        }
        this.moveBody();
        this.head.style.top = value + 'px';
        this.checkOverlap()
    }
    //蛇增加身体长度
    addBody(){
        this.element.insertAdjacentHTML("beforeend", "<div></div>")
    }
    //身体移动
    moveBody(){
        //将后面的身体设置到前一个身体的位置，一节一节修改
        for(let i = this.body.length-1; i>0; i --){
            let X = (this.body[i-1] as HTMLElement).offsetLeft;
            let Y = (this.body[i-1] as HTMLElement).offsetTop;
            (this.body[i] as HTMLElement).style.left  = X + 'px';
            (this.body[i] as HTMLElement).style.top  = Y + 'px';

        }
    }
    checkOverlap (){
        for (let i=1; i<this.body.length; i++){
            let body = this.body[i] as HTMLElement;
            if (this.X === body.offsetLeft&&this.Y === body.offsetTop){
                throw new Error('Head and body are overlap, Game Over!')
            }
        }
    }
}

class GameControl{
    snake:Snake;
    food:Food;
    scorePanel:ScorePanel;
    direction:string;
    isLive:boolean;
    constructor(){
        this.snake = new Snake();
        this.food = new Food();
        this.scorePanel = new ScorePanel();
        this.direction = '';
        this.isLive = true;
        this.init()
    }
    init(){
        document.addEventListener('keydown',this.keydownHandler.bind(this))//在这里改变以下this指向
        this.run();
    }
    keydownHandler(event:KeyboardEvent){
        //这里的this指向不对，对象的this是谁调用指向谁，这里是document调用就指向document了

        this.direction = event.key;
        console.log(this.direction)

    }
    run(){
        //根据方向来使蛇的位置改变
        //top++ top-- left++ left--
        let X = this.snake.X
        let Y = this.snake.Y
        switch(this.direction){
            case "ArrowUp":
            case "Up":
                Y -= 10;
                break;
            case "ArrowDown":
            case "Down":
                Y += 10;
                break;
            case "ArrowRight":
            case "Right":
                X += 10;
                break;
            case "ArrowLeft":
            case "Left":
                X -= 10;
                break;
        }
        this.checkEat(X,Y)
        try {
            this.snake.X = X;
            this.snake.Y = Y;           
        } catch (error) {
            alert((error as any).message);
            this.isLive = false;
        }

        this.isLive&&setTimeout(this.run.bind(this),330 - (this.scorePanel.level*30))
    }
    //定义一个方法检测蛇是否吃到食物。
    checkEat(X:number, Y:number){
        if (X === this.food.X && Y === this.food.Y){
            this.food.change();
            this.scorePanel.scoreUp();
            this.snake.addBody();
        }
    }
}

const gameControl = new GameControl()
