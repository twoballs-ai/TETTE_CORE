// PhysicsEngine.js
export class PhysicsEngine {
  constructor(gravity = 9.8) {
    this.gravity = gravity;
  }

  updatePhysics(gameObjects, deltaTime) {
    gameObjects.forEach(gameObject => {
      if (gameObject.rigidBody) {
        this.applyGravity(gameObject, deltaTime);
        this.applyMovement(gameObject, deltaTime);
      }
    });

    gameObjects.forEach(gameObject => {
      if (gameObject.rigidBody) {
        const otherObjects = gameObjects.filter(obj => obj !== gameObject && obj.rigidBody);
        this.checkCollisions(gameObject, otherObjects);
      }
    });
  }

  applyGravity(gameObject, deltaTime) {
    const rigidBody = gameObject.rigidBody;
    if (!rigidBody || rigidBody.isStatic) return;

    const deltaSeconds = deltaTime / 1000;
    rigidBody.velocityY += this.gravity * deltaSeconds * 100;
  }

  applyMovement(gameObject, deltaTime) {
    const rigidBody = gameObject.rigidBody;
    if (!rigidBody || rigidBody.isStatic) return;

    const deltaSeconds = deltaTime / 1000;
    rigidBody.velocityX *= rigidBody.friction;
    rigidBody.velocityY *= rigidBody.friction;

    rigidBody.x += rigidBody.velocityX * deltaSeconds;
    rigidBody.y += rigidBody.velocityY * deltaSeconds;

    // Обновляем позиции объекта
    gameObject.x = rigidBody.x;
    gameObject.y = rigidBody.y;
  }

  checkCollisions(gameObject, objects) {
    objects.forEach(otherObject => {
      if (otherObject.rigidBody && this.isColliding(gameObject, otherObject)) {
        this.resolveCollision(gameObject, otherObject);
      }
    });
  }

  isColliding(obj1, obj2) {
    const rb1 = obj1.rigidBody;
    const rb2 = obj2.rigidBody;

    return (
      rb1.x < rb2.x + rb2.width &&
      rb1.x + rb1.width > rb2.x &&
      rb1.y < rb2.y + rb2.height &&
      rb1.y + rb1.height > rb2.y
    );
  }

  resolveCollision(gameObject, otherObject) {
    const rb1 = gameObject.rigidBody;
    const rb2 = otherObject.rigidBody;

    if (rb2.isStatic) {
      // Столкновение с статическим объектом (например, пол)
      if (rb1.velocityY > 0) { // Если объект падает
        rb1.y = rb2.y - rb1.height; // Ставим объект на поверхность
        rb1.velocityY = 0; // Обнуляем скорость падения
        rb1.onGround = true;
      }
    } else {
      // Обработка столкновений между подвижными объектами (если необходимо)
    }

    // Обновляем позиции объекта
    gameObject.x = rb1.x;
    gameObject.y = rb1.y;
  }
}
