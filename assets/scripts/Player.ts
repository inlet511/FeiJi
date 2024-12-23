import { _decorator, Component, Node, Input, input, EventTouch, Vec3, instantiate, Prefab, Collider2D, Contact2DType, Animation, AnimationState } from 'cc';
import { Enemy } from './Enemy';
import {GameManager} from './GameManager';

const { ccclass, property } = _decorator;

enum ShootType{
    Single,
    Dual
};

@ccclass('Player')
export class Player extends Component {

    @property
    shoot_rate:number = 0.5;

    shoot_timer:number = 0.5;


    @property
    health:number = 3;

    @property(Prefab)
    bulletPrefab:Prefab = null;

    @property(Prefab)
    bullet2Prefab:Prefab = null;

    @property(Node)
    bulletParent:Node = null;

    @property(Node)
    fireposition1:Node = null;

    @property(Node)
    fireposition2:Node = null;

    @property(Node)
    fireposition3:Node = null;

    @property(ShootType)
    shootType:ShootType = ShootType.Single;

    @property
    invincibleTime:number = 1;

    invincibleTimer:number = 0;

    isInvincible:boolean = false;

    collider:Collider2D = null;

    anim:Animation = null;

    protected start(): void {       

        // 注册collider 事件
        this.collider = this.node.getComponentInChildren(Collider2D);
        if(this.collider)
        {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }

        // 注册anim事件
        this.anim = this.node.getComponentInChildren(Animation);
        if(this.anim)
        {
            this.anim.on(Animation.EventType.FINISHED, this.onAnimFinished, this);
        }

        // 注册GameManager事件
        //GameManager.Instance.eventTarget.on("player_die",this.onPlayerDie, this);
        GameManager.Instance.listenTo("player_die", this.onPlayerDie, this);
    }

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE,this.onTouchMove, this);

        // 注销collider事件
        if(this.collider)
        {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }

        // 注销anim事件
        if(this.anim)
        {
            this.anim.off(Animation.EventType.FINISHED, this.onAnimFinished, this)
        }
    }

    // 碰撞事件
    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        if(this.isInvincible)
        {
            return;
        }


        if(otherCollider && otherCollider.node.getParent().getComponent(Enemy))
        {
            this.health -= 1;
            if(this.health>0)
            {
                this.anim.play("player_blink");
                //设置为无敌
                this.isInvincible = true;
                this.invincibleTimer = 0;
            }else
            {
                this.anim.play("player_die");
            }
        }
    }

    // 动画播放完成事件
    onAnimFinished(type: Animation.EventType, state: AnimationState)
    {
        if(state.clip.name == "player_die")
        {
            GameManager.Instance.broadcastPlayerDie();
        }
    }

    onPlayerDie()
    {
        this.scheduleOnce(()=>{
            this.node.destroy();
        },0);
    }


    onTouchMove(event:EventTouch)
    {
        const p = this.node.position;

        const targetP = new Vec3(p.x + event.getDeltaX(), p.y + event.getDeltaY(), p.z);

        if(targetP.x < -230)
        {
            targetP.x = -230;
        }
        if(targetP.x > 230)
        {
            targetP.x = 230;
        }

        if(targetP.y > 380)
        {
            targetP.y = 380;
        }
        if(targetP.y < -380)
        {
            targetP.y = -380;
        }

        this.node.setPosition(targetP);
    }

    protected update(dt: number): void {
        switch(this.shootType)
        {
            case ShootType.Single:
                this.singleShoot(dt);
                break;
            case ShootType.Dual:
                this.dualShoot(dt);
                break;
        }

        if(this.isInvincible){
            this.invincibleTimer += dt;
            if(this.invincibleTimer>this.invincibleTime)
            {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }
    }

    singleShoot(dt:number)
    {
        this.shoot_timer += dt;

        if(this.shoot_timer >=this.shoot_rate)
        {
            this.shoot_timer = 0;
            const bullet1 = instantiate(this.bulletPrefab);
            this.bulletParent.addChild(bullet1);
            bullet1.setWorldPosition(this.fireposition1.worldPosition);
        }
    }

    dualShoot(dt:number)
    {
        this.shoot_timer += dt;

        if(this.shoot_timer >=this.shoot_rate)
        {
            this.shoot_timer = 0;
            const bullet1 = instantiate(this.bullet2Prefab);
            const bullet2 = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet1);
            this.bulletParent.addChild(bullet2);
            bullet1.setWorldPosition(this.fireposition2.worldPosition);
            bullet2.setWorldPosition(this.fireposition3.worldPosition);
        }
    }
}


