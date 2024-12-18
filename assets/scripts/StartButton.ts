import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartButton')
export class StartButton extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onStartBtnClick(){
        director.loadScene("02-game");
    }
}


