const D = require('globals');
let enemyBPosition = cc.Class({
	name: 'enemyBPosition',
	properties: {
		xAxis: {
			default: ''
		},
		yAxis: {
			default: ''
		}
	}
});
let enemybulletIfe = cc.Class({
	name: 'enemybulletIfe',
	properties: {
		name: '',
		freqTime: 0,
		initPoolCount: 0,
		prefab: cc.Prefab,
		position: {
			default: [],
			type: enemyBPosition
		}
	}
});
cc.Class({
	extends: cc.Component,
	properties: () => ({
		enemybulletIfe: {
			default: null,
			type: enemybulletIfe
		}
	}),
	onLoad() {
		this.eState = D.commonInfo.gameState.start;
		//初始enemy bullet
		D.common.initObjPool(this, this.enemybulletIfe);
	},
	startAction(gteBEnemyInfo) {
		let enemy = gteBEnemyInfo.getComponent('enemy');
		let cbName = gteBEnemyInfo.uuid + 'Callback';
		this[cbName] = function() { this.getNewbullet(this.enemybulletIfe, gteBEnemyInfo) }.bind(this);
		this.schedule(this[cbName], enemy.enemyBulletFreq);
		return cbName
	},
	pauseAction() {
		this.enabled = false;
		this.eState = D.commonInfo.gameState.pause;
	},
	resumeAction() {
		this.enabled = true;
		this.eState = D.commonInfo.gameState.start;
	},
	//生成敌机子弹
	getNewbullet(bulletInfo, gteInfo) {
		let poolName = bulletInfo.name + 'Pool';
		for (let bc = 0; bc < bulletInfo.position.length; bc++) {
			let newNode = D.common.genNewNode(this[poolName], bulletInfo.prefab, this.node);
			let newV2 = this.getBulletPostion(bulletInfo.position[bc], gteInfo);
			newNode.setPosition(newV2);
			let newNodeComp = newNode.getComponent('enemy_bullet');
			newNodeComp.poolName = poolName;
			newNodeComp.ySpeed = gteInfo.getComponent('enemy').ySpeed - 50;
		}
	},
	//获取子弹位置
	getBulletPostion(posInfo, gteInfo) {
		let hPos = gteInfo.getPosition();
		let newV2_x = hPos.x + parseFloat(posInfo.xAxis);
		let newV2_y = hPos.y + parseFloat(posInfo.yAxis);
		return cc.p(newV2_x, newV2_y);
	},
	unscheduleForEnemyBullet(name) {
		this.unschedule(this[name]);
	},
	//回收节点
	bulletDied(nodeinfo) {
		let poolName = nodeinfo.getComponent('enemy_bullet').poolName;
		D.common.backObjPool(this, poolName, nodeinfo);
	}
})

