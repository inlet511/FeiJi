import { _decorator, Component, Node, Animation, Collider, Collider2D, Contact2DType, IPhysics2DContact, AnimationState } from 'cc';
import { Bullet } from './Bullet';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 300;

    anim: Animation = null;

    @property
    anim_hit:string = "";

    @property
    anim_die:string = "";

    collider: Collider2D = null;

    @property
    health: number = 1;

    gameFinished:bool = false;

    start() {
        const child = this.node.children[0];
        this.anim = child.getComponent(Animation);
        this.collider = child.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        GameManager.Instance.listenTo("player_die", this.playerDied, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider && otherCollider.node && otherCollider.node.getComponent(Bullet)) {

            this.scheduleOnce(()=>{
                if(otherCollider && otherCollider.node && otherCollider.node.getComponent(Bullet))
                    otherCollider.node.destroy();
                }
                ,0);

            this.health -= 1;
            if(this.health>0)
            {
                if(this.anim_hit!="")
                    this.anim.play(this.anim_hit);
            }
            else
            {
                if (this.collider) {
                    this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                    this.collider.destroy();
                }

                if(this.anim_die!="")
                {
                    this.anim.play(this.anim_die);
                    this.anim.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
                }
                
            }
        }
    }

    onAnimationFinished(type: Animation.EventType, state: AnimationState) {
        this.node.destroy();
    }

    update(deltaTime: number) {
        if(this.gameFinished)
            return;

        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
        if (p.y < -600) {
            this.node.destroy();
        }
    }

    protected onDestroy(): void {

    }

    playerDied()
    {
        console.log(this.node.name + "received player died event");
        this.gameFinished = true;
    }

}


