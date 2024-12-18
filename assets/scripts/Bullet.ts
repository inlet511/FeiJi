import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    @property
    speed:number = 200;

    start() {

    }

    update(deltaTime: number) {
        const p = this.node.getPosition();
        this.node.setPosition(p.x, p.y + deltaTime * this.speed, p.z);

        if(this.node.position.y > 440)
        {
            this.node.destroy();
        }
    }
}


