var world_BattleBots = new function() {
  var self = this;

  this.name = 'battlebots';
  this.shortDescription = 'BattleBots Arena';
  this.longDescription =
    '<p>Battle your robots in a dramatic arena with HP tracking, ring-out detection, and spark effects!</p>' +
    '<p>Each robot starts with configurable HP. Collisions deal damage based on impact velocity. ' +
    'Get knocked off the platform or lose all HP to be eliminated. Last bot standing wins!</p>';
  this.thumbnail = 'images/worlds/battlebots.jpg';

  this.options = {};
  this.robotStart = null;
  this.arenaStart = null;

  // Starting positions: 4 corners facing center
  this.arenaStarts = [
    {
      position: new BABYLON.Vector3(-40, 0, 40),
      rotation: new BABYLON.Vector3(0, 3/4 * Math.PI, 0)
    },
    {
      position: new BABYLON.Vector3(-40, 0, -40),
      rotation: new BABYLON.Vector3(0, 1/4 * Math.PI, 0)
    },
    {
      position: new BABYLON.Vector3(40, 0, 40),
      rotation: new BABYLON.Vector3(0, -3/4 * Math.PI, 0)
    },
    {
      position: new BABYLON.Vector3(40, 0, -40),
      rotation: new BABYLON.Vector3(0, -1/4 * Math.PI, 0)
    },
  ];

  this.optionsConfigurations = [
    {
      option: 'startingHP',
      title: 'Starting HP',
      type: 'slider',
      min: 50,
      max: 200,
      step: 10,
      help: 'Hit points each robot starts with.'
    },
    {
      option: 'timeLimit',
      title: 'Time Limit',
      type: 'checkbox',
      label: 'Stop robots when time is up',
      help: 'Stop all robot motors when time is up. Highest HP wins.'
    },
    {
      option: 'seed',
      title: 'Random Seed',
      type: 'text',
      help: 'Leave this blank to let gears pick its own random seed.'
    },
    {
      option: 'startPos',
      title: 'Starting Position (Single Player Mode)',
      type: 'select',
      options: [
        ['Player 0', '0'],
        ['Player 1', '1'],
        ['Player 2', '2'],
        ['Player 3', '3'],
      ],
      help: 'This option does nothing in Arena mode.'
    }
  ];

  this.defaultOptions = {
    startingHP: 100,
    length: 400,
    width: 400,
    wall: false,
    wallHeight: 0,
    wallThickness: 0,
    groundFriction: 1,
    wallFriction: 0.1,
    groundRestitution: 0.0,
    wallRestitution: 0.1,
    startPos: '0',
    timeLimit: true,
    seed: null,
  };

  // Damage constants
  var MIN_THRESHOLD = 3;
  var DAMAGE_SCALE = 2.0;
  var DAMAGE_COOLDOWN = 300; // ms
  var BIG_HIT_THRESHOLD = 15;

  // Saved lighting values for restore
  var savedLightHemiIntensity = null;
  var savedLightDirIntensity = null;

  // Collision tracking
  var collisionCooldowns = {};
  var sparkTexture = null;
  var arenaMeshes = [];

  // Set options, including default
  this.setOptions = function(options) {
    Object.assign(self.options, self.defaultOptions);

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }

    self.arenaStart = self.arenaStarts;
    self.robotStart = self.arenaStart[parseInt(self.options.startPos)];

    return new Promise(function(resolve, reject) {
      resolve();
    });
  };

  // Run on page load
  this.init = function() {
    self.setOptions();
  };

  // Create the scene
  this.load = function(scene) {
    return new Promise(function(resolve, reject) {
      // Set standby game state
      self.game = {
        state: 'standby',
        startTime: null,
        renderTimeout: 0,
        hp: [0, 0, 0, 0],
        hits: [0, 0, 0, 0],
        damageDealt: [0, 0, 0, 0],
        eliminated: [false, false, false, false],
        lastCollider: [-1, -1, -1, -1],
        winner: -1,
      };

      // Initialize HP
      for (var i = 0; i < 4; i++) {
        self.game.hp[i] = self.options.startingHP;
      }

      // Store original lighting
      savedLightHemiIntensity = babylon.lightHemi.intensity;
      savedLightDirIntensity = babylon.lightDir.intensity;

      // Darker dramatic lighting
      babylon.lightHemi.intensity = 0.3;
      babylon.lightDir.intensity = 0.5;

      // Darker sky
      scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);

      // Create octagonal platform
      self.buildArena(scene);

      // Create cage visuals
      self.buildCage(scene);

      // Create spark texture for particles
      sparkTexture = new BABYLON.DynamicTexture('sparkTex', 16, scene, false);
      var ctx = sparkTexture.getContext();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();
      sparkTexture.update();

      // Time limit: 2 minutes
      self.game.TIME_LIMIT = 2 * 60 * 1000;

      // Set render and score functions
      self.render = self.battleRender;
      self.drawWorldInfo = self.drawBattleInfo;

      self.buildBattleInfoPanel();
      self.drawWorldInfo();

      resolve();
    });
  };

  // Build octagonal arena platform
  this.buildArena = function(scene) {
    arenaMeshes = [];

    // Octagonal platform using cylinder with 8 tessellation
    var groundMat = new BABYLON.StandardMaterial('battleGround', scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.3);
    groundMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    groundMat.specularPower = 32;

    var platform = BABYLON.MeshBuilder.CreateCylinder('platform', {
      height: 10,
      diameter: 240,
      tessellation: 8
    }, scene);
    platform.material = groundMat;
    platform.position.y = -5;
    platform.receiveShadows = true;

    platform.physicsImpostor = new BABYLON.PhysicsImpostor(
      platform,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      {
        mass: 0,
        friction: self.options.groundFriction,
        restitution: self.options.groundRestitution
      },
      scene
    );

    arenaMeshes.push(platform);

    // Add danger markings: a slightly larger, darker ring underneath
    var edgeMat = new BABYLON.StandardMaterial('edgeMark', scene);
    edgeMat.diffuseColor = new BABYLON.Color3(0.6, 0.15, 0.15);
    edgeMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    var edgeRing = BABYLON.MeshBuilder.CreateCylinder('edgeRing', {
      height: 0.5,
      diameter: 240,
      tessellation: 8
    }, scene);
    edgeRing.material = edgeMat;
    edgeRing.position.y = 0.26;
    edgeRing.receiveShadows = true;

    // Inner circle (covers the center, leaving only the edge visible as a danger stripe)
    var innerMat = new BABYLON.StandardMaterial('innerMark', scene);
    innerMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.3);
    innerMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

    var innerCircle = BABYLON.MeshBuilder.CreateCylinder('innerCircle', {
      height: 0.6,
      diameter: 210,
      tessellation: 8
    }, scene);
    innerCircle.material = innerMat;
    innerCircle.position.y = 0.26;
    innerCircle.receiveShadows = true;

    arenaMeshes.push(edgeRing);
    arenaMeshes.push(innerCircle);
  };

  // Build cage visuals (decorative only, no physics)
  this.buildCage = function(scene) {
    var cageMat = new BABYLON.StandardMaterial('cage', scene);
    cageMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.4);
    cageMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cageMat.alpha = 0.7;

    var POST_RADIUS = 1.5;
    var POST_HEIGHT = 60;
    var CAGE_RADIUS = 125;
    var BAR_RADIUS = 0.8;

    // 8 vertical posts around the octagon
    var posts = [];
    for (var i = 0; i < 8; i++) {
      var angle = (i / 8) * Math.PI * 2;
      var x = Math.cos(angle) * CAGE_RADIUS;
      var z = Math.sin(angle) * CAGE_RADIUS;

      var post = BABYLON.MeshBuilder.CreateCylinder('cagePost' + i, {
        height: POST_HEIGHT,
        diameter: POST_RADIUS * 2,
        tessellation: 8
      }, scene);
      post.material = cageMat;
      post.position.x = x;
      post.position.y = POST_HEIGHT / 2;
      post.position.z = z;
      post.isPickable = false;
      posts.push(post);
    }

    // Horizontal bars connecting posts at the top
    for (var i = 0; i < 8; i++) {
      var next = (i + 1) % 8;
      var p1 = posts[i].position;
      var p2 = posts[next].position;

      var distance = BABYLON.Vector3.Distance(p1, p2);
      var midpoint = BABYLON.Vector3.Center(p1, p2);

      var bar = BABYLON.MeshBuilder.CreateCylinder('cageBar' + i, {
        height: distance,
        diameter: BAR_RADIUS * 2,
        tessellation: 6
      }, scene);
      bar.material = cageMat;
      bar.position = new BABYLON.Vector3(midpoint.x, POST_HEIGHT, midpoint.z);
      bar.isPickable = false;

      // Rotate bar to connect the two posts
      var direction = p2.subtract(p1).normalize();
      var angle = Math.atan2(direction.x, direction.z);
      bar.rotation.x = Math.PI / 2;
      bar.rotation.z = -angle;
    }

    // Second ring of bars at mid-height
    for (var i = 0; i < 8; i++) {
      var next = (i + 1) % 8;
      var p1 = posts[i].position;
      var p2 = posts[next].position;

      var distance = BABYLON.Vector3.Distance(p1, p2);
      var midpoint = BABYLON.Vector3.Center(p1, p2);

      var bar = BABYLON.MeshBuilder.CreateCylinder('cageBarMid' + i, {
        height: distance,
        diameter: BAR_RADIUS * 2,
        tessellation: 6
      }, scene);
      bar.material = cageMat;
      bar.position = new BABYLON.Vector3(midpoint.x, POST_HEIGHT / 2, midpoint.z);
      bar.isPickable = false;

      var direction = p2.subtract(p1).normalize();
      var angle = Math.atan2(direction.x, direction.z);
      bar.rotation.x = Math.PI / 2;
      bar.rotation.z = -angle;
    }
  };

  // Register collision handlers on robot body impostors
  this.registerCollisions = function() {
    collisionCooldowns = {};

    for (var i = 0; i < robots.length; i++) {
      if (robots[i].disabled || !robots[i].body || !robots[i].body.physicsImpostor) continue;

      for (var j = i + 1; j < robots.length; j++) {
        if (robots[j].disabled || !robots[j].body || !robots[j].body.physicsImpostor) continue;

        (function(pi, pj) {
          robots[pi].body.physicsImpostor.registerOnPhysicsCollide(
            robots[pj].body.physicsImpostor,
            function(ownImpostor, otherImpostor) {
              self.handleCollision(pi, pj, ownImpostor, otherImpostor);
            }
          );
        })(i, j);
      }
    }
  };

  // Handle collision between two robots
  this.handleCollision = function(pi, pj, ownImpostor, otherImpostor) {
    if (self.game.state !== 'started') return;
    if (self.game.eliminated[pi] || self.game.eliminated[pj]) return;

    // Cooldown check
    var pairKey = Math.min(pi, pj) + '_' + Math.max(pi, pj);
    var now = Date.now();
    if (collisionCooldowns[pairKey] && (now - collisionCooldowns[pairKey]) < DAMAGE_COOLDOWN) {
      return;
    }
    collisionCooldowns[pairKey] = now;

    // Calculate relative velocity
    var vel1 = ownImpostor.getLinearVelocity();
    var vel2 = otherImpostor.getLinearVelocity();
    var relativeVelocity = vel1.subtract(vel2).length();

    if (relativeVelocity < MIN_THRESHOLD) return;

    var damage = Math.max(0, (relativeVelocity - MIN_THRESHOLD) * DAMAGE_SCALE);
    damage = Math.round(damage * 10) / 10;

    if (damage <= 0) return;

    // Determine who is the attacker (faster robot)
    var speed1 = vel1.length();
    var speed2 = vel2.length();

    // Both take damage, but faster robot takes less
    var damage1, damage2;
    if (speed1 > speed2) {
      // Robot pi is faster (attacker), takes less
      damage1 = damage * 0.4;
      damage2 = damage;
      self.game.lastCollider[pj] = pi;
    } else {
      damage1 = damage;
      damage2 = damage * 0.4;
      self.game.lastCollider[pi] = pj;
    }

    // Apply damage
    self.game.hp[pi] = Math.max(0, self.game.hp[pi] - damage1);
    self.game.hp[pj] = Math.max(0, self.game.hp[pj] - damage2);

    // Track hits and damage
    self.game.hits[pi]++;
    self.game.hits[pj]++;
    self.game.damageDealt[pi] += damage2;
    self.game.damageDealt[pj] += damage1;

    // Visual effects
    var midpoint = ownImpostor.object.absolutePosition.add(otherImpostor.object.absolutePosition).scale(0.5);
    self.spawnSparks(midpoint, damage);

    // Flash hit robots
    self.flashRobotHit(pi);
    self.flashRobotHit(pj);

    // Screen shake on big hits
    if (damage >= BIG_HIT_THRESHOLD) {
      self.screenShake();
    }

    // Check for elimination by HP
    if (self.game.hp[pi] <= 0 && !self.game.eliminated[pi]) {
      self.eliminatePlayer(pi, 'hp');
    }
    if (self.game.hp[pj] <= 0 && !self.game.eliminated[pj]) {
      self.eliminatePlayer(pj, 'hp');
    }
  };

  // Eliminate a player
  this.eliminatePlayer = function(player, reason) {
    self.game.eliminated[player] = true;

    // Log to console
    var reasonText = reason === 'ringout' ? 'RING OUT' : 'DESTROYED';
    if (typeof arenaPanel !== 'undefined') {
      arenaPanel.consoleWrite('Player ' + player + ' ELIMINATED (' + reasonText + ')!\n');
    }

    // Check win condition
    self.checkWinCondition();
  };

  // Check if battle is over
  this.checkWinCondition = function() {
    if (self.game.state !== 'started') return;

    var alive = [];
    for (var i = 0; i < robots.length; i++) {
      if (!robots[i].disabled && !self.game.eliminated[i]) {
        alive.push(i);
      }
    }

    if (alive.length <= 1) {
      self.game.state = 'finished';
      if (alive.length === 1) {
        self.game.winner = alive[0];
        if (typeof arenaPanel !== 'undefined') {
          arenaPanel.consoleWrite('Player ' + alive[0] + ' WINS!\n');
          arenaPanel.stopSim();
        }
      } else {
        // All eliminated at once (draw)
        self.game.winner = -1;
        if (typeof arenaPanel !== 'undefined') {
          arenaPanel.consoleWrite('DRAW! All robots eliminated!\n');
          arenaPanel.stopSim();
        }
      }
      self.drawWorldInfo();
    }
  };

  // Spark particle effect at collision point
  this.spawnSparks = function(position, damage) {
    if (!sparkTexture) return;
    var scene = babylon.scene;

    var ps = new BABYLON.ParticleSystem('sparks', 80, scene);
    ps.particleTexture = sparkTexture;

    ps.emitter = position.clone();
    ps.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
    ps.maxEmitBox = new BABYLON.Vector3(1, 1, 1);

    ps.minSize = 0.2;
    ps.maxSize = 0.5;

    ps.minLifeTime = 0.3;
    ps.maxLifeTime = 0.8;

    // Emit outward in all directions
    ps.direction1 = new BABYLON.Vector3(-4, 2, -4);
    ps.direction2 = new BABYLON.Vector3(4, 8, 4);

    ps.gravity = new BABYLON.Vector3(0, -20, 0);

    // Scale emit power with damage
    var power = Math.min(damage / 10, 3);
    ps.minEmitPower = 1 + power;
    ps.maxEmitPower = 3 + power * 2;

    ps.emitRate = 200;
    ps.updateSpeed = 0.01;

    // Orange, yellow, white spark colors
    ps.color1 = new BABYLON.Color4(1, 0.6, 0.1, 1);
    ps.color2 = new BABYLON.Color4(1, 0.9, 0.3, 1);
    ps.colorDead = new BABYLON.Color4(1, 0.3, 0, 0);

    ps.minAngularSpeed = -6;
    ps.maxAngularSpeed = 6;

    // Additive blend for brightness
    ps.blendMode = BABYLON.ParticleSystem.BLEND_ADD;

    ps.start();

    // Stop emitting after short burst
    setTimeout(function() {
      ps.stop();
    }, 150);
    // Dispose after particles fade
    setTimeout(function() {
      ps.dispose();
    }, 1500);
  };

  // Flash robot body red on hit
  this.flashRobotHit = function(player) {
    if (!robots[player] || !robots[player].body) return;

    var body = robots[player].body;
    if (!body.material) return;

    var originalEmissive = body.material.emissiveColor ? body.material.emissiveColor.clone() : new BABYLON.Color3(0, 0, 0);
    body.material.emissiveColor = new BABYLON.Color3(0.8, 0.1, 0.1);

    setTimeout(function() {
      if (body.material) {
        body.material.emissiveColor = originalEmissive;
      }
    }, 200);
  };

  // Screen shake on big hits
  this.screenShake = function() {
    if (!babylon.cameraArc) return;
    var originalTarget = babylon.cameraArc.target.clone();
    var shakeCount = 0;
    var maxShakes = 6;

    function shake() {
      if (shakeCount >= maxShakes) {
        babylon.cameraArc.target = originalTarget;
        return;
      }
      var offset = new BABYLON.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 3
      );
      babylon.cameraArc.target = originalTarget.add(offset);
      shakeCount++;
      setTimeout(shake, 30);
    }
    shake();
  };

  // Battle render loop
  this.battleRender = function(delta) {
    // Throttle to 200ms
    self.game.renderTimeout += delta;
    if (self.game.renderTimeout > 200) {
      self.game.renderTimeout = 0;
    } else {
      return;
    }

    if (self.game.state === 'started') {
      // Check ring-outs
      for (var i = 0; i < robots.length; i++) {
        if (robots[i].disabled || self.game.eliminated[i]) continue;
        if (robots[i].body && robots[i].body.position.y < -5) {
          self.eliminatePlayer(i, 'ringout');

          // Award to last collider
          var lastHitter = self.game.lastCollider[i];
          if (lastHitter >= 0 && !self.game.eliminated[lastHitter]) {
            self.game.damageDealt[lastHitter] += 20; // bonus for ring-out assist
          }
        }
      }

      // Check time limit
      if (self.options.timeLimit && self.game.startTime) {
        var elapsed = Date.now() - self.game.startTime;
        if (elapsed >= self.game.TIME_LIMIT && self.game.state === 'started') {
          // Time's up: determine winner by HP
          self.game.state = 'finished';

          var bestHP = -1;
          var bestPlayer = -1;
          var tied = false;
          for (var i = 0; i < robots.length; i++) {
            if (robots[i].disabled || self.game.eliminated[i]) continue;
            if (self.game.hp[i] > bestHP) {
              bestHP = self.game.hp[i];
              bestPlayer = i;
              tied = false;
            } else if (self.game.hp[i] === bestHP) {
              // Tie break by damage dealt
              if (self.game.damageDealt[i] > self.game.damageDealt[bestPlayer]) {
                bestPlayer = i;
                tied = false;
              } else if (self.game.damageDealt[i] === self.game.damageDealt[bestPlayer]) {
                tied = true;
              }
            }
          }

          if (bestPlayer >= 0 && !tied) {
            self.game.winner = bestPlayer;
            if (typeof arenaPanel !== 'undefined') {
              arenaPanel.consoleWrite('TIME UP! Player ' + bestPlayer + ' wins with ' + bestHP + ' HP!\n');
              arenaPanel.stopSim();
            }
          } else {
            self.game.winner = -1;
            if (typeof arenaPanel !== 'undefined') {
              arenaPanel.consoleWrite('TIME UP! DRAW!\n');
              arenaPanel.stopSim();
            }
          }
        }
      }

      self.drawWorldInfo();
    }
  };

  // Build the battle info panel
  this.buildBattleInfoPanel = function() {
    if (typeof arenaPanel == 'undefined') {
      setTimeout(self.buildBattleInfoPanel, 1000);
      return;
    }

    arenaPanel.showWorldInfoPanel();
    arenaPanel.clearWorldInfoPanel();

    var $info = $(
      '<div class="mono battleInfo">' +
        '<div class="row"><div class="center time"></div></div>' +
        '<div class="row">' +
          '<div class="hpBar p0"><span class="label">P0</span><div class="barBg"><div class="barFill"></div></div><span class="hpText"></span></div>' +
          '<div class="hpBar p2"><span class="label">P2</span><div class="barBg"><div class="barFill"></div></div><span class="hpText"></span></div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="hpBar p1"><span class="label">P1</span><div class="barBg"><div class="barFill"></div></div><span class="hpText"></span></div>' +
          '<div class="hpBar p3"><span class="label">P3</span><div class="barBg"><div class="barFill"></div></div><span class="hpText"></span></div>' +
        '</div>' +
        '<div class="row"><div class="center battleStatus"></div></div>' +
      '</div>' +
      '<style>' +
        '.battleInfo .hpBar { display: flex; align-items: center; gap: 4px; padding: 1px 4px; flex: 1; }' +
        '.battleInfo .hpBar .label { font-weight: bold; min-width: 22px; font-size: 11px; }' +
        '.battleInfo .hpBar .barBg { flex: 1; height: 10px; background: #333; border-radius: 3px; overflow: hidden; }' +
        '.battleInfo .hpBar .barFill { height: 100%; background: #4c4; border-radius: 3px; transition: width 0.2s, background-color 0.3s; }' +
        '.battleInfo .hpBar .hpText { font-size: 10px; min-width: 28px; text-align: right; }' +
        '.battleInfo .hpBar.eliminated .barFill { background: #555 !important; }' +
        '.battleInfo .hpBar.eliminated .label { text-decoration: line-through; opacity: 0.5; }' +
        '.battleInfo .p0 .label { color: #4af; }' +
        '.battleInfo .p1 .label { color: #f44; }' +
        '.battleInfo .p2 .label { color: #4f4; }' +
        '.battleInfo .p3 .label { color: #fa4; }' +
        '.battleInfo .battleStatus { font-weight: bold; font-size: 12px; color: #ff4; padding: 2px; }' +
      '</style>'
    );
    arenaPanel.drawWorldInfo($info);

    self.infoPanel = {
      $time: $info.find('.time'),
      $p: [
        $info.find('.hpBar.p0'),
        $info.find('.hpBar.p1'),
        $info.find('.hpBar.p2'),
        $info.find('.hpBar.p3')
      ],
      $status: $info.find('.battleStatus'),
    };
  };

  // Draw battle info
  this.drawBattleInfo = function() {
    if (typeof self.infoPanel == 'undefined') {
      setTimeout(self.drawBattleInfo, 1000);
      return;
    }

    // Time display
    var time = self.game.TIME_LIMIT;
    if (time == Infinity) {
      time = 'Infinite';
    } else {
      if (self.game.startTime != null) {
        time -= (Date.now() - self.game.startTime);
      }
      var sign = '';
      if (time < 0) {
        sign = '-';
        time = -time;
      }
      time = Math.round(time / 1000);
      if (time < 0) time = 0;
      time = sign + Math.floor(time / 60) + ':' + ('0' + time % 60).slice(-2);
    }
    self.infoPanel.$time.text('Time: ' + time);

    // HP bars
    var maxHP = self.options.startingHP;
    for (var i = 0; i < 4; i++) {
      if (robots[i] && !robots[i].disabled) {
        self.infoPanel.$p[i].show();
        var hp = Math.max(0, self.game.hp[i]);
        var pct = (hp / maxHP) * 100;

        var $fill = self.infoPanel.$p[i].find('.barFill');
        $fill.css('width', pct + '%');

        // Color: green > yellow > orange > red
        var r, g;
        if (pct > 50) {
          r = Math.round(255 * (1 - (pct - 50) / 50));
          g = 200;
        } else {
          r = 255;
          g = Math.round(200 * (pct / 50));
        }
        $fill.css('background-color', 'rgb(' + r + ',' + g + ',50)');

        self.infoPanel.$p[i].find('.hpText').text(Math.round(hp));

        if (self.game.eliminated[i]) {
          self.infoPanel.$p[i].addClass('eliminated');
          self.infoPanel.$p[i].find('.hpText').text('OUT');
        }
      } else {
        self.infoPanel.$p[i].hide();
      }
    }

    // Status text
    if (self.game.state === 'finished') {
      if (self.game.winner >= 0) {
        self.infoPanel.$status.text('PLAYER ' + self.game.winner + ' WINS!');
      } else {
        self.infoPanel.$status.text('DRAW!');
      }
    } else if (self.game.state === 'started') {
      self.infoPanel.$status.text('');
    } else {
      self.infoPanel.$status.text('');
    }
  };

  // Reset game state
  this.reset = function() {
    setTimeout(function() {
      if (typeof self.game != 'undefined') {
        self.game.state = 'ready';

        // Re-init HP
        for (var i = 0; i < 4; i++) {
          self.game.hp[i] = self.options.startingHP;
          self.game.hits[i] = 0;
          self.game.damageDealt[i] = 0;
          self.game.eliminated[i] = false;
          self.game.lastCollider[i] = -1;
        }
        self.game.winner = -1;

        // Register collision handlers after scene reset
        self.registerCollisions();
      }
    }, 500);
  };

  // Called by babylon and filled by individual challenges
  this.render = function(delta) {};

  // Draw world info panel
  this.drawWorldInfo = function() {};

  // startSim
  this.startSim = function() {
    if (typeof self.game != 'undefined') {
      self.game.state = 'started';
      self.game.startTime = Date.now();
    }
  };

  // stop simulator
  this.stopSim = function() {
    if (typeof self.game != 'undefined') {
      if (self.game.state !== 'finished') {
        self.game.state = 'stopped';
      }
    }

    // Restore lighting
    if (savedLightHemiIntensity !== null) {
      babylon.lightHemi.intensity = savedLightHemiIntensity;
      savedLightHemiIntensity = null;
    }
    if (savedLightDirIntensity !== null) {
      babylon.lightDir.intensity = savedLightDirIntensity;
      savedLightDirIntensity = null;
    }

    // Restore sky color
    if (babylon.scene) {
      babylon.scene.clearColor = new BABYLON.Color3(0.53, 0.81, 0.92);
    }
  };
}

// Init class
world_BattleBots.init();

if (typeof worlds == 'undefined') {
  var worlds = [];
}
worlds.push(world_BattleBots);
