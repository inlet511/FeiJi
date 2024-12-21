import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;


interface NoParamCallback{
    ():void;
}

@ccclass('GameManager')
export class GameManager{
    private static _instance :GameManager = null;
    public eventTarget:EventTarget = null;    

    public static get Instance()
    {
        if(this._instance == null)
        {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    private constructor(){
        this.eventTarget = new EventTarget();
    }

    public listenTo(eventType:string, func: NoParamCallback, target)
    {
        this.eventTarget.on(eventType, func,target);
    }

    public broadcastPlayerDie()
    {
        this.eventTarget.emit("player_die");
    }
}


