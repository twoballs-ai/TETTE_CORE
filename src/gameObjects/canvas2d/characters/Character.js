// Character.js
import { RigidBody2d } from '../../../core/physics/RigidBody2d.js';

export class Character {
  constructor({
    x,
    y,
    width,
    height,
    color,
    sprite,
    animations = {},
    health = 100,
    speed = 30,
    enablePhysics = false,
    layer = 1,
    preserveAspectRatio = false
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.health = health;
    this.speed = speed;
    this.layer = layer;
    this.preserveAspectRatio = preserveAspectRatio;

    this.currentFrameIndex = 0;
    this.frameDuration = 100;
    this.elapsedTime = 0;
    this.facingDirection = 1;

    this.sprite = sprite ? new Image() : null;
    if (this.sprite) {
      this.sprite.src = sprite;
    }

    this.animations = {
      idle: animations.idle || [],
      run: animations.run || [],
      jump: animations.jump || [],
      attack: animations.attack || [],
    };

    if (!this.sprite && this.animations.idle.length === 0) {
      console.warn('Character must have either a sprite or an idle animation.');
    }

    for (const key in this.animations) {
      this.animations[key] = this.animations[key].map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });
    }

    this.currentAnimation = this.sprite ? null : 'idle';

    if (enablePhysics) {
      this.rigidBody = new RigidBody2d({
        mass: 1,
        friction: 0.9,
        isStatic: false,
      });

      this.rigidBody.x = this.x;
      this.rigidBody.y = this.y;
      this.rigidBody.width = this.width;
      this.rigidBody.height = this.height;
    } else {
      this.rigidBody = null;
    }
  }

  setAnimation(animationName) {
    if (
      this.animations[animationName] &&
      this.animations[animationName].length > 0
    ) {
      if (this.currentAnimation !== animationName) {
        this.currentAnimation = animationName;
        this.currentFrameIndex = 0;
        this.elapsedTime = 0;
      }
    }
  }

  update(deltaTime) {
    if (this.rigidBody) {
      this.x = this.rigidBody.x;
      this.y = this.rigidBody.y;

      if (this.rigidBody.velocityX > 0) {
        this.facingDirection = 1;
      } else if (this.rigidBody.velocityX < 0) {
        this.facingDirection = -1;
      }

      if (!this.rigidBody.onGround) {
        this.setAnimation('jump');
      } else if (this.rigidBody.velocityX !== 0) {
        this.setAnimation('run');
      } else {
        this.setAnimation('idle');
      }
    }

    const activeFrames = this.currentAnimation
      ? this.animations[this.currentAnimation]
      : [];
    if (activeFrames.length > 0) {
      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= this.frameDuration) {
        this.elapsedTime = 0;
        this.currentFrameIndex =
          (this.currentFrameIndex + 1) % activeFrames.length;
      }
    }
  }

  containsPoint(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  render(context) {
    context.save();

    if (this.facingDirection === -1) {
      context.translate(this.x + this.width / 2, this.y);
      context.scale(-1, 1);
      context.translate(-this.width / 2, 0);
    } else {
      context.translate(this.x, this.y);
    }

    if (this.sprite && this.sprite.complete) {
      let renderWidth = this.width;
      let renderHeight = this.height;

      if (this.preserveAspectRatio) {
        const aspectRatio = this.sprite.width / this.sprite.height;
        if (this.width / this.height > aspectRatio) {
          renderWidth = this.height * aspectRatio;
        } else {
          renderHeight = this.width / aspectRatio;
        }
      }

      context.drawImage(this.sprite, 0, 0, renderWidth, renderHeight);
    } else {
      const activeFrames = this.currentAnimation
        ? this.animations[this.currentAnimation]
        : [];

      if (
        activeFrames.length > 0 &&
        activeFrames[this.currentFrameIndex].complete
      ) {
        context.drawImage(
          activeFrames[this.currentFrameIndex],
          0,
          0,
          this.width,
          this.height
        );
      } else {
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.height);
      }
    }

    context.restore();
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    console.log('Character died');
  }
}
