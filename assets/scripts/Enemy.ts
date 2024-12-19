import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed:number = 300;

    anim:Animation = null;

    start() {
        const child = this.node.children[0];
        this.anim = child.getComponent(Animation);

        const clips = this.anim.clips;

        if (clips.length > 0) {
            // 播放第一个动画片段
            this.anim.play(clips[0].name);  // 使用动画片段的名称来播放
        }

    }

    update(deltaTime: number) {
        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
    }
}


