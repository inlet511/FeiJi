import { _decorator, CCInteger, Component, instantiate, math, Node, Prefab} from 'cc';
const { ccclass, property } = _decorator;
import {GameManager} from './GameManager';

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property([CCInteger])
    enemySpawnRate:number[] = [];

    @property([Prefab])
    enemyPrefabs:Prefab[] = new Array<Prefab>;

    
    start() {
        // 注意不能用var i, 否则i始终都是一个值的引用
        for(let i = 0; i<3; i++)
        {
            this.schedule(
                ()=>{this.enemySpawn(i)},
                this.enemySpawnRate[i]);
        }

        GameManager.Instance.listenTo("player_die", this.onPlayerDied, this);
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

    enemySpawn(idx:number){
        const prefab = this.enemyPrefabs[idx];
        if(!prefab)
        {
            console.error(`Prefab at index ${idx} is invalid.`);
            return;
        }
        const enemy = instantiate(prefab);
        this.node.addChild(enemy);
        enemy.setPosition(math.randomRangeInt(-215,215),550,0);
    }

    onPlayerDied(){
        this.unscheduleAllCallbacks();
    }

}


