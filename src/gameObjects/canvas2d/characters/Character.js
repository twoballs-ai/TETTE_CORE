import { RigidBody2d } from '../../../core/physics/RigidBody2d.js';

export class Character {
  constructor({
    x,
    y,
    width,
    height,
    color, // теперь можно игнорировать или не передавать цвет
    image,
    animations = {},
    health = 100,
    speed = 30,
    enablePhysics = false,
    layer = 1,
    preserveAspectRatio = false,
    animatedCharacter = false, // true — использовать анимации, false — использовать спрайт (изображение)
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
    this.animatedCharacter = animatedCharacter;

    this.currentFrameIndex = 0;
    this.frameDuration = 100;
    this.elapsedTime = 0;
    this.facingDirection = 1;

    // Если не используется анимация, загружаем статичное изображение.
    if (!this.animatedCharacter && image) {
      this.image = new Image();
      this.image.src = image;
    } else {
      this.image = null;
    }

    // Если используется анимация, обрабатываем пути к кадрам.
    // Если анимация не используется, оставляем пустые массивы.
    this.animations = {
      idle: this.animatedCharacter ? (animations.idle || []) : [],
      run: this.animatedCharacter ? (animations.run || []) : [],
      jump: this.animatedCharacter ? (animations.jump || []) : [],
      attack: this.animatedCharacter ? (animations.attack || []) : [],
    };

    if (this.animatedCharacter) {
      // Преобразуем пути анимаций в объекты Image.
      for (const key in this.animations) {
        this.animations[key] = this.animations[key].map((src) => {
          const img = new Image();
          img.src = src;
          return img;
        });
      }
      if (this.animations.idle.length === 0) {
        console.warn('Character must have an idle animation when animatedCharacter is true.');
      }
    } else {
      if (!this.image) {
        console.warn('Character must have an image when animatedCharacter is false.');
      }
    }

    // Устанавливаем текущую анимацию для анимированных персонажей.
    this.currentAnimation = this.animatedCharacter ? 'idle' : null;

    // Если включена физика, создаём физическое тело.
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
      this.animatedCharacter &&
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

    if (this.animatedCharacter && this.currentAnimation) {
      const activeFrames = this.animations[this.currentAnimation] || [];
      if (activeFrames.length > 0) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.frameDuration) {
          this.elapsedTime = 0;
          this.currentFrameIndex = (this.currentFrameIndex + 1) % activeFrames.length;
        }
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

    // Обработка зеркального отображения (отражение по горизонтали).
    if (this.facingDirection === -1) {
      context.translate(this.x + this.width / 2, this.y);
      context.scale(-1, 1);
      context.translate(-this.width / 2, 0);
    } else {
      context.translate(this.x, this.y);
    }

    // Если не используется анимация – отрисовываем статичное изображение.
    if (!this.animatedCharacter && this.image && this.image.complete) {
      let renderWidth = this.width;
      let renderHeight = this.height;

      if (this.preserveAspectRatio) {
        const aspectRatio = this.image.width / this.image.height;
        if (this.width / this.height > aspectRatio) {
          renderWidth = this.height * aspectRatio;
        } else {
          renderHeight = this.width / aspectRatio;
        }
      }
      context.drawImage(this.image, 0, 0, renderWidth, renderHeight);
    }
    // Если используется анимация – отрисовываем текущий кадр.
    else if (this.animatedCharacter) {
      const activeFrames = this.currentAnimation ? this.animations[this.currentAnimation] : [];
      if (activeFrames.length > 0 && activeFrames[this.currentFrameIndex].complete) {
        context.drawImage(activeFrames[this.currentFrameIndex], 0, 0, this.width, this.height);
      } else {
        console.warn('Character has no animation available for rendering.');
      }
    } else {
      console.warn('Character has no image or animation available for rendering.');
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
    // console.log('Character died');
  }
}
