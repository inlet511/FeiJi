import { _decorator, Component, Node, Input, input, EventTouch, Vec3, instantiate, Prefab } from 'cc';
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


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE,this.onTouchMove, this);
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


