import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BGLoop')
export class BGLoop extends Component {

    @property(Node)
    public bg01:Node = null;

    @property(Node)
    public bg02:Node = null;

    @property
    rollspeed:number = 100;

    update(deltaTime: number) {
        let pos1 = this.bg01.getPosition();
        let newY1 = pos1.y - this.rollspeed * deltaTime;
        this.bg01.setPosition(pos1.x, newY1, pos1.z);

        let pos2 = this.bg02.getPosition();
        let newY2 = pos2.y - this.rollspeed * deltaTime;
        this.bg02.setPosition(pos2.x, newY2, pos2.z);

        if(this.bg01.position.y < -852)
        {
            this.bg01.setPosition(pos1.x, this.bg02.getPosition().y + 852, pos1.z);
        }
        if(this.bg02.position.y < -852)
        {
            this.bg02.setPosition(pos2.x, this.bg01.getPosition().y + 852, pos2.z);
        }
    }
}


