import RockPlatformsGroup from '../objects/RockPlatformGroup';
import Player from '../objects/Player';

class GameState extends Phaser.State {

	create() {
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.center = { x: this.game.world.centerX, y: this.game.world.centerY }; 			
		this.music = this.game.add.audio('ambientMusic');
		this.jumpSound = this.game.add.audio('jump');
		this.playMusic();
		this.game.add.sprite(0, 0, 'starsBg');
		this.lava = this.game.add.tileSprite(0, 530, this.game.stage.game.width, 292, 'lava');
		this.rockPlatforms = new RockPlatformsGroup(this.game, 5);
		this.animatePlatforms();
		this.player = new Player(this.game);
  
	}

	playMusic(){
		this.music.play();
	}

	animatePlatforms(){  
        const that = this;

        const goDown = () => {
            const tween = that.game.add.tween(that.rockPlatforms).to({ y: that.rockPlatforms.position.y + 100 }, 3000, Phaser.Easing.Quadratic.InOut, true, 0);
            tween.onComplete.add(goUp, that);
        }

        const goUp = () => {
            const tween2 = that.game.add.tween(that.rockPlatforms).to({ y: that.rockPlatforms.position.y - 100 }, 3000, Phaser.Easing.Quadratic.InOut, true, 0);
            tween2.onComplete.add(goDown, that); 
        }

        
        goDown();
	}

	update(){

		this.lava.tilePosition.x += 0.6;
		this.game.physics.arcade.collide(this.player, this.rockPlatforms);

		const grounded = this.player.body.touching.down;
        if(grounded && !this.cursors.left.isDown && !this.cursors.right.isDown){
            this.player.animations.play('idle');    
        }
        
        if (this.cursors.up.isDown) {
            if(grounded){
                this.player.animations.play('playerJump'); 
                this.player.body.velocity.y = -250;
                this.jumpSound.play();
            }
        }

        if (this.cursors.left.isDown) {
            this.player.scale.x = -1;
            if (grounded){
                this.player.body.velocity.x = -200;
                this.player.animations.play('playerRun');  
            }else{
                this.player.animations.play('playerJump'); 
            }
            this.player.body.velocity.x = -200;
        } else if (this.cursors.right.isDown) {

            this.player.scale.x = 1;
            if (grounded){
                this.player.body.velocity.x = 200;
                this.player.animations.play('playerRun');
            }else{
                this.player.animations.play('playerJump'); 
            }
        } else {
            if (grounded){
                this.player.body.velocity.x = 0;
            }
        }
	}

	

}

export default GameState;