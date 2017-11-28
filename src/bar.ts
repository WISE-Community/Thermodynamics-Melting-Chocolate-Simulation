import * as $ from 'jquery';

export class Bar {

  // a reference to the simulation
  heatingCoolingBarSimulation: any;

  // the svg.js object
  draw: any;

  // the svg.js image object for the bar
  image: any;

  // the svg.js text object for the material name
  text: any;

  // the checkmark
  checkMark: any;

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
  constructor(heatingCoolingBarSimulation, draw, material, image, width, height, x, y) {
    this.heatingCoolingBarSimulation = heatingCoolingBarSimulation;
    this.draw = draw;
    this.image = this.draw.image(image, width, height).attr({
      'x': x,
      'y': y
    });
    this.material = material;
    this.materialLabel = material.charAt(0).toUpperCase() + material.substring(1);

    // the material label shown to the left of the bar
    this.text = this.draw.text(this.materialLabel).x(x - 100).y(y);

    this.createIron(x - 60, y - 15);
    this.hideIron();

    this.createAirConditioner(x - 50, y - 20);
    this.hideAirConditioner();

    this.createCheckMark(x - 130, y - 4);
    this.hideCheckMark();

    this.createHeatMask(width, height, x, y);
    this.createCoolMask(width, height, x, y);

    this.createCups(x + 150, y - 42);
    this.hideCup();

    this.createTimer(x + 220, y);
    this.hideTimer();

    /*
     * We will store all the animations in this array which will be used for
     * pausing and resuming animations.
     */
    this.allAnimations = [];

    this.image.click(() => {
      this.clicked();
    });

    this.text.click(() => {
      this.clicked();
    });

    this.heatMaskRect.click(() => {
      this.clicked();
    });
  }

  /**
   * Set the state of the bar.
   * @param state a string which can be 'initialized', 'playing', 'paused', or
   * 'completed'
   */
  setState(state) {
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
  createIron(x, y) {
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
   * Create the air conditioner on and off images.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createAirConditioner(x, y) {
    this.airConditionerOn = this.draw.image('./images/airConditionerOn.png', 50, 50).move(x, y);
    this.airConditionerOff = this.draw.image('./images/airConditionerOff.png', 50, 50).move(x, y);
  }

  hideAirConditioner() {
    this.airConditionerOn.hide();
    this.airConditionerOff.hide();
  }

  showAirConditioner() {
    this.airConditionerOn.hide();
    this.airConditionerOff.show();
  }

  turnOnAirConditioner() {
    this.airConditionerOff.hide();
    this.airConditionerOn.show();
    this.coolDownBar();
  }

  /**
   * Create the cups. The cups will all be on top of each other. The hot cup
   * will be behind the warm cup which will be behind the cold cup. We will will
   * later change which cup is on top depending on whether the student is
   * running the heating or cooling simulation.
   * @param x the x position in pixels
   * @param y the y position in pixels
   */
  createCups(x, y) {
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
   * Create the check mark.
   * @param x the x position of the check mark in pixels
   * @param y the y posision of the check mark in pixels
   */
  createCheckMark(x, y) {
    this.checkMark = this.draw.image('./images/ic_check_black_24px.svg', 24, 24).move(x, y);
  }

  hideCheckMark() {
    this.checkMark.hide();
  }

  showCheckMark() {
    this.checkMark.show();
  }

  /**
   * Create the timer.
   * @param x the x position of the timer
   * @param y the y position of the timer
   */
  createTimer(x, y) {
    this.timerText = this.draw.text(this.timer + ' seconds').move(x, y);
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
      this.timer += 1;
      this.timerText.text(this.timer + ' seconds');
    }
  }

  /**
   * Reset the timer to 0.
   */
  resetTimer() {
    this.timer = 0;
    this.timerText.text(this.timer + ' seconds');
  }

  /**
   * The student clicked on this bar.
   */
  clicked() {
    if (this.heatingCoolingBarSimulation.isGuessingEnabled()) {
      this.heatingCoolingBarSimulation.barClicked(this.material);
      this.showCheckMark();
    }
  }

  /**
   * Create the heat mask that we will show when the simulation starts running.
   * @param width the width of the heat mask in pixels
   * @param height the height of the heat mask in pixels
   * @param x the x position of the heat mask in pixels
   * @param y the y position of the heat mask in pixels
   */
  createHeatMask(width, height, x, y) {
    this.heatMask = this.draw.polygon('130,122 130,100 150,90 525,90 525,114 515,122').fill('white');
    this.heatMask.width(width - 2).height(height - 1);
    this.heatMask.x(x).y(y);
    this.heatMaskRect = this.draw.rect(0, 35).attr({
      'x': x,
      'y': y
    }).opacity(.3).fill('red');
    this.heatMaskRect.maskWith(this.heatMask);
  }

  /**
   * Create the cool mask that we will show when the simulation starts running.
   * @param width the width of the cool mask in pixels
   * @param height the height of the cool mask in pixels
   * @param x the x position of the cool mask in pixels
   * @param y the y position of the cool mask in pixels
   */
  createCoolMask(width, height, x, y) {
    this.coolMask = this.draw.polygon('130,122 130,100 150,90 525,90 525,114 515,122').fill('white');
    this.coolMask.width(width - 2).height(height - 1);
    this.coolMask.x(x).y(y);
    this.coolMaskRect = this.draw.rect(0, 35).attr({
      'x': x,
      'y': y
    }).opacity(.3).fill('blue');
    this.coolMaskRect.maskWith(this.coolMask);
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
  }

  /**
   * The student is running the cooling simulation and has chosen a bar so now
   * we will get ready to start the simulation by showing the appropriate
   * elements on the screen. The simulation will not start until the student
   * clicks the Play button.
   */
  setupCooling() {
    this.showAirConditioner();
    this.hotCup.front();
    this.hotCup.show();
    this.hotCup.opacity(1);
    this.coldCup.show();
    this.coldCup.opacity(1);
    this.heatMaskRect.attr('width', 200);
  }

  /**
   * Reset the iron position.
   */
  resetIronPosition() {
    this.iron.x(this.originalIronPosition);
  }

  /**
   * Add an animation to our array of animation objects.
   * @param animation an svg.js animation object
   */
  addAnimation(animation) {
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
    this.barHeatAnimation = this.heatMaskRect.animate(multiplier * 3000 + 3000).attr({
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
    this.coldCupAnimation = this.coldCup.animate(4000).opacity(0).after(() => {
      this.setState('completed');
      // tell the simulation that this bar is completed
      this.heatingCoolingBarSimulation.barAnimationCompleted(this.material);
    }).duringAll((pos) => {
      // update the timer that is shown to the student
      this.updateTimer();
    });

    this.addAnimation(this.coldCupAnimation);
  }

  hideHeat() {
    this.heatMaskRect.hide();
  }

  resetHeat() {
    this.heatMaskRect.attr({ 'width': 0 });
  }

  resetCool() {
    this.coolMaskRect.attr({ 'width': 0 });
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
    this.barCoolAnimation = this.coolMaskRect.animate(multiplier * 3000 + 3000).attr({
      'width': 200
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
    this.hotCupAnimation = this.hotCup.animate(4000).opacity(0).after(() => {
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
   * Start playing the simulation
   */
  play(setting) {
    if (this.getState() != 'completed') {
      this.setState('playing');
      this.showTimer();

      if (setting == 'heating') {
        this.moveIronToBar();
      } else if (setting == 'cooling') {
        this.turnOnAirConditioner();
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
    this.resetHeat();
    this.resetCool();
    this.resetCup();
    this.resetIronPosition();
    this.resetTimer();
    this.hideTimer();
    this.hideCheckMark();
    this.hideIron();
    this.hideAirConditioner();
    this.clearAllAnimations();
    this.setState('initialized');
  }
}
