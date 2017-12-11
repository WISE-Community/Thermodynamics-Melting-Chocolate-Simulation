import * as $ from 'jquery';

export class Bar {

  // a reference to the simulation
  heatingCoolingBarSimulation: any;

  // whether this bar is heating or cooling
  mode: string;

  // the svg.js object
  draw: any;

  // the svg.js image object for the bar
  image: any;

  // the svg.js text object for the material name
  text: any;

  // the name of the matieral
  material: string;

  // the name of the material with an uppercase first letter
  materialLabel: string;

  // the timer for how much time has surpassed
  timer: number = 0;

  // an array of all the animations
  allAnimations: object[];

  /**
   * Create the svg.js elements for the bar.
   * @param heatingCoolingBarSimulation a reference to the simulation
   * @param draw the svg.js object
   * @param material a string containing the name of the material 'metal',
   * 'glass', 'wood'
   * @param image a string containing the path to the image
   * @param width the width of the bar in pixels
   * @param height the height of the bar in pixels
   * @param x the x position of the bar in pixels
   * @param y the y position of the bar in pixels
   */
  constructor(heatingCoolingBarSimulation: HeatingCoolingBarSimulation,
      draw: object,
      material: string,
      image: string,
      width: number,
      height: number,
      x: number,
      y: number,
      mode: string) {
    this.heatingCoolingBarSimulation = heatingCoolingBarSimulation;
    this.mode = mode;
    this.draw = draw;

    this.createPredictionBox(x - 130, y - 40);
    this.hidePredictionBox();

    this.image = this.draw.image(image, width, height).attr({
      'x': x,
      'y': y
    });
    this.material = material;
    this.materialLabel = material.charAt(0).toUpperCase() + material.substring(1);

    // the material label shown to the left of the bar
    this.text = this.draw.text(this.materialLabel).x(x - 100).y(y);

    this.createIron(x - 60, y - 20);
    this.hideIron();

    this.createIceCube(x - 50, y - 20);
    this.hideIceCube();

    this.createHeatPolygon(width, height, x, y);
    this.hideHeatPolygon();
    this.createHeatMask(x, y);

    this.createCups(x + 150, y - 42);
    this.hideCup();

    this.createTimer(x + 220, y);
    this.hideTimer();

    this.createInvisibleClickBox(x - 130, y - 40);
    this.enableClicking();

    /*
     * We will store all the animations in this array which will be used for
     * pausing and resuming animations.
     */
    this.allAnimations = [];
  }

  /**
   * Create the invisible box that we will place over all the elements
   * associated with this bar. This includes the material text label, iron,
   * ice cube, cup, timer text, etc. The student can click anywhere on this
   * box to select this bar as their prediction.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createInvisibleClickBox(x: number, y: number) {
    this.invisibleClickBox = this.draw.rect(480, 80);
    this.invisibleClickBox.move(x, y);
    this.invisibleClickBox.attr('fill-opacity', 0);
    this.invisibleClickBox.attr( { cursor: 'pointer' } );

    this.invisibleClickBox.click(() => {
      this.clicked();
    });

    this.invisibleClickBox.front();
  }

  /**
   * Make the cursor change to a hand when it is over the invisible click box.
   */
  enableClicking() {
    this.invisibleClickBox.attr( { cursor: 'pointer' } );
  }

  /**
   * Make the cursor not change to a hand.
   */
  disableClicking() {
    this.invisibleClickBox.attr( { cursor: null } );
  }

  /**
   * Set the state of the bar.
   * @param state a string which can be 'initialized', 'playing', 'paused', or
   * 'completed'
   */
  setState(state: string) {
    this.state = state;
  }

  /**
   * Get the state of the bar.
   * @return a string which can be 'initialized', 'playing', 'paused', or
   * 'completed'
   */
  getState() {
    return this.state;
  }

  /**
   * Create the iron image.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createIron(x: number, y: number) {
    // remember the original position so we can reset it
    this.originalIronPosition = x;

    // create the iron
    this.iron = this.draw.image('./images/iron.png', 50, 50).move(x, y);
  }

  hideIron() {
    this.iron.hide();
  }

  showIron() {
    this.iron.show();
  }

  /**
   * Reset the iron position.
   */
  resetIronPosition() {
    this.iron.x(this.originalIronPosition);
  }

  /**
   * Create the ice cube image.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createIceCube(x: number, y: number) {
    this.originalIceCubePosition = x;
    this.iceCube = this.draw.image('./images/iceCube.png', 50, 50).move(x, y);
  }

  hideIceCube() {
    this.iceCube.hide();
  }

  showIceCube() {
    this.iceCube.show();
  }

  /**
   * Create the cups. The cups will all be on top of each other. The hot cup
   * will be behind the warm cup which will be behind the cold cup. We will will
   * later change which cup is on top depending on whether the student is
   * running the heating or cooling simulation.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createCups(x: number, y: number) {
    this.hotCup = this.draw.image('./images/hotCup.png', 50, 50).move(x, y);
    this.coldCup = this.draw.image('./images/coldCup.png', 50, 50).move(x, y);
  }

  hideCup() {
    this.hotCup.hide();
    this.coldCup.hide();
  }

  showCup() {
    this.hotCup.show();
    this.coldCup.show();
  }

  /**
   * Create the box that surrounds the student's prediction. This also contains
   * the "My Prediction" text at the upper left of the box.
   * @param x the x position of the box from the upper left
   * @param y the y position of the box from the upper left
   */
  createPredictionBox(x: number, y: number) {
    this.predictionBox = this.draw.rect(480, 80);
    this.predictionBox.move(x, y);
    this.predictionBox.attr('fill-opacity', 0);
    this.predictionBox.stroke({ width: 1 });

    this.predictionText = this.draw.text('My Prediction');
    this.predictionText.font({ size: 13 });
    this.predictionText.move(x + 10, y + 6);
  }

  hidePredictionBox() {
    this.predictionBox.hide();
    this.predictionText.hide();
  }

  showPredictionBox() {
    this.predictionBox.show();
    this.predictionText.show();
  }

  /**
   * Get the timer text that we will display to the student.
   * @param time the number of minutes
   * @return a string that will display how much time has passed
   * example "5 minutes"
   */
  getTimerText(time: number) {
    return time + ' minutes';
  }

  /**
   * Create the timer.
   * @param x the x position of the timer
   * @param y the y position of the timer
   */
  createTimer(x: number, y: number) {
    this.timerText = this.draw.text(this.getTimerText(this.timer)).move(x, y);
  }

  hideTimer() {
    this.timerText.hide();
  }

  showTimer() {
    this.timerText.show();
  }

  /**
   * Update the timer that is displayed to the student.
   */
  updateTimer() {
    if (this.getState() == 'playing') {
      this.timer += 2;
      let minutes = Math.floor(this.timer / 60);
      this.timerText.text(this.getTimerText(minutes));
    }
  }

  /**
   * Manually set the timer.
   * @param seconds the time
   */
  setTimer(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    this.timerText.text(this.getTimerText(minutes));
  }

  /**
   * Reset the timer to 0.
   */
  resetTimer() {
    this.timer = 0;
    this.timerText.text(this.getTimerText(this.timer));
  }

  /**
   * Set the color of the timer text.
   * @param color A string containing the color name or hex color.
   */
  setTimerColor(color) {
    this.timerText.fill(color);
  }

  /**
   * Set the timer color back to its original value of black.
   */
  resetTimerColor() {
    this.timerText.fill('black');
  }

  /**
   * The student clicked on this bar.
   */
  clicked() {
    if (this.heatingCoolingBarSimulation.isGuessingEnabled()) {
      this.heatingCoolingBarSimulation.barClicked(this.material);
      this.showPredictionBox();
    }
  }

  /**
   * Create the polygon that represents the heat on the bar.
   * @param width the width of the cool mask in pixels
   * @param height the height of the cool mask in pixels
   * @param x the x position of the cool mask in pixels
   * @param y the y position of the cool mask in pixels
   */
  createHeatPolygon(width: number, height: number, x: number, y: number) {
    this.heatPolygon = this.draw.polygon('130,122 130,100 150,90 525,90 525,114 515,122');
    this.heatPolygon.width(width - 2).height(height - 1);
    this.heatPolygon.x(x).y(y);
    this.heatPolygon.fill('red');
  }

  /**
   * Show the heat on the bar.
   */
  showHeatPolygon() {
    this.heatPolygon.show();
  }

  /**
   * Hide the heat on the bar.
   */
  hideHeatPolygon() {
    this.heatPolygon.hide();
  }

  /**
   * Create the mask on the heat polygon that we will use to animate the heat
   * entering or leaving the bar.
   */
  createHeatMask(x: number, y: number) {
    this.heatMaskOriginalX = x;
    this.heatMaskOriginalHeatingWidth = 0;
    this.heatMaskOriginalCoolingWidth = 200;
    this.heatMask = this.draw.rect(this.heatMaskOriginalHeatingWidth, 35).attr({
      'x': x,
      'y': y
    }).fill('red');
    this.heatPolygon.maskWith(this.heatMask);
  }

  /**
   * Reset the heat mask back to its original position and width for heating.
   */
  setupHeatMaskForHeating() {
    this.heatMask.attr({ x: this.heatMaskOriginalX });
    this.heatMask.attr({ width: this.heatMaskOriginalHeatingWidth });
  }

  /**
   * Reset the heat mask back to its original position and width for cooling.
   */
  setupHeatMaskForCooling() {
    this.heatMask.attr({ x: this.heatMaskOriginalX });
    this.heatMask.attr({ width: this.heatMaskOriginalCoolingWidth });
  }

  /**
   * The student is running the heating simulation and has chosen a bar so now
   * we will get ready to start the simulation by showing the appropriate
   * elements on the screen. The simulation will not start until the student
   * clicks the Play button.
   */
  setupHeating() {
    this.showIron();
    this.coldCup.front();
    this.coldCup.show();
    this.coldCup.opacity(1);
    this.hotCup.show();
    this.hotCup.opacity(1);
    this.invisibleClickBox.front();
    this.showHeatPolygon();
    this.setupHeatMaskForHeating();
  }

  /**
   * The student is running the cooling simulation and has chosen a bar so now
   * we will get ready to start the simulation by showing the appropriate
   * elements on the screen. The simulation will not start until the student
   * clicks the Play button.
   */
  setupCooling() {
    this.showIceCube();
    this.hotCup.front();
    this.hotCup.show();
    this.hotCup.opacity(1);
    this.coldCup.show();
    this.coldCup.opacity(1);
    this.invisibleClickBox.front();
    this.showHeatPolygon();
    this.setupHeatMaskForCooling();
  }

  /**
   * Add an animation to our array of animation objects.
   * @param animation an svg.js animation object
   */
  addAnimation(animation: object) {
    this.allAnimations.push(animation);
  }

  /**
   * Clear the array of animation objects.
   */
  clearAllAnimations() {
    this.allAnimations = [];
  }

  /**
   * Move the iron so that it touches and begins heating the bar.
   */
  moveIronToBar() {
    this.ironAnimation = this.iron.animate().x(this.originalIronPosition + 20).after(() => {
      this.heatUpBar();
    });
    this.addAnimation(this.ironAnimation);
  }

  /**
   * Start heating up the bar by animating the red mask.
   */
  heatUpBar() {
    let multiplier = 1;

    if (this.material == 'metal') {
      multiplier = 1;
    } else if (this.material == 'glass') {
      multiplier = 2;
    } else if (this.material == 'wood') {
      multiplier = 4;
    }

    // show the heat mask on the bar
    this.barHeatAnimation = this.heatMask.animate(multiplier * 2000 + 500).attr({
      'width': 200
    }).after(() => { this.heatUpCup(); }).duringAll((pos) => {
      // update the timer that is shown to the student
      this.updateTimer();
    });
    this.addAnimation(this.barHeatAnimation);
  }

  /**
   * Start heating up the cup.
   */
  heatUpCup() {
    // slowly hide the cold cup which will reveal the hot cup behind it
    this.coldCupAnimation = this.coldCup.animate(1000).opacity(0).after(() => {
      this.setState('completed');
      // tell the simulation that this bar is completed
      this.heatingCoolingBarSimulation.barAnimationCompleted(this.material);
    }).duringAll((pos) => {
      // update the timer that is shown to the student
      this.updateTimer();
    });

    this.addAnimation(this.coldCupAnimation);
  }

  /**
   * Move the ice cube so that it touches and begins cooling the bar.
   */
  moveIceCubeToBar() {
    this.iceCubeAnimation = this.iceCube.animate()
        .x(this.originalIronPosition + 18).after(() => {
      this.coolDownBar();
    });
    this.addAnimation(this.iceCubeAnimation);
  }

  /**
   * Reset the ice cube to its original position.
   */
  resetIceCubePosition() {
    this.iceCube.x(this.originalIceCubePosition);
  }

  /**
   * Start cooling down the bar by animating the blue mask.
   */
  coolDownBar() {
    let multiplier = 1;

    if (this.material == 'metal') {
      multiplier = 1;
    } else if (this.material == 'glass') {
      multiplier = 2;
    } else if (this.material == 'wood') {
      multiplier = 4;
    }

    // show the cool mask on the bar
    this.barCoolAnimation = this.heatMask.animate(multiplier * 2000 + 500).attr({
      'x': 340
    }).after(() => { this.coolDownCup(); }).duringAll((pos) => {
      // update the timer that is shown to the student
      this.updateTimer();
    });
    this.addAnimation(this.barCoolAnimation);
  }

  /**
   * Start cooling down the cup.
   */
  coolDownCup() {
    // slowly hide the hot cup which will reveal the cold cup behind it
    this.hotCupAnimation = this.hotCup.animate(1000).opacity(0).after(() => {
      this.setState('completed');
      // tell the simulation that this bar is completed
      this.heatingCoolingBarSimulation.barAnimationCompleted(this.material);
    }).duringAll((pos) => {
      // update the timer that is shown to the student
      this.updateTimer();
    });
    this.addAnimation(this.hotCupAnimation);
  }

  /**
   * Reset the cups back to their initial state.
   */
  resetCup() {
    // remove the transparancy from the cups so they are solid again
    this.coldCup.opacity(1);
    this.hotCup.opacity(1);

    this.hideCup();
  }

  /**
   * Start playing the simulation.
   * @param mode 'heating' or 'cooling' mode
   */
  play(mode: string) {
    if (this.getState() != 'completed') {
      this.setState('playing');
      this.disableClicking();
      this.showTimer();

      if (mode == 'heating') {
        this.moveIronToBar();
      } else if (mode == 'cooling') {
        this.moveIceCubeToBar();
      }
    }
  }

  /**
   * Pause the simulation.
   */
  pause() {
    if (this.getState() != 'completed') {
      this.setState('paused');
      for (let animation of this.allAnimations) {
        animation.pause();
      }
    }
  }

  /**
   * Resume the simulation.
   */
  resume() {
    if (this.getState() != 'completed') {
      this.setState('playing');
      for (let animation of this.allAnimations) {
        if (animation.active) {
          animation.play();
        }
      }
    }
  }

  /**
   * Stop the simulation.
   */
  stop() {
    let jumpToEnd = true;
    let clearQueue = true;

    for (let animation of this.allAnimations) {
      animation.paused = false;
      animation.stop(jumpToEnd, clearQueue);
    }
  }

  /**
   * Reset the simulation back to its initial state.
   */
  reset() {
    this.stop();
    this.resetCup();
    this.resetIronPosition();
    this.resetIceCubePosition();
    this.resetTimer();
    this.resetTimerColor();
    this.hideTimer();
    this.hideHeatPolygon();
    this.hidePredictionBox();
    this.hideIron();
    this.hideIceCube();
    this.clearAllAnimations();
    this.enableClicking();
    this.setState('initialized');
  }
}
