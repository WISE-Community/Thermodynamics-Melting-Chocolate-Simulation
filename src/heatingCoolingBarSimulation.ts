import { Bar } from './bar';
import { Controls } from './controls';
import { parseURLParameters } from './util';
import { capitalizeFirstLetter } from './util';
import * as $ from 'jquery';
import * as SVG from 'svgjs';

export class HeatingCoolingBarSimulation {
  /*
   * the state of the simulation which can be 'initialized', 'playing', 'paused'
   * or 'completed'
   */
  state: string;

  // the svg.js element we will use to draw and animate
  draw: any;

  // handles the logic for the button
  controls: Controls;

  // the bars
  metalBar: Bar;
  glassBar: Bar;
  woodBar: Bar;

  // an array containing all the bars
  bars: Bar[] = [];

  /*
   * the name of the material the student clicked which can be 'metal', 'glass'
   * or 'wood'
   */
  materialClicked: string;

  // whether the student is currently allowed to click on a material
  guessingEnabled: boolean;

  // the messages we will show to the student
  heatingClickOnTheMaterialMessage: string = 'Click on the material that you think will heat up the fastest.';
  heatingClickThePlayButtonMessage: string = 'Click the Play button to start heating up the bars.';
  coolingClickOnTheMaterialMessage: string = 'Click on the material that you think will cool down the fastest.';
  coolingClickThePlayButtonMessage: string = 'Click the Play button to start cooling down the bars.';

  // whether the simulation can run in heating mode
  allowHeating: boolean;

  // whether the simulation can run in cooling mode
  allowCooling: boolean;

  //
  mode: string;
  parameters: any;
  barVisbility: any = {
    'metal': true,
    'glass': true,
    'wood': true
  };
  fastestMaterial: string = 'metal';
  slowestMaterial: string = 'wood';

  /**
   * Initialize the simulation.
   */
  constructor() {

    // obtain the GET parameters
    this.parameters = parseURLParameters();
    this.setParameters(this.parameters);

    this.setState('initialized');

    // handles the play/pause and reset buttons
    this.controls = new Controls(this);

    /*
     * disable the play/pause button and reset button until the student has
     * chosen a material
     */
    this.controls.disablePlayPauseButton();
    this.controls.disableResetButton();

    this.draw = SVG('model');

    this.mode = 'heating';

    if (this.allowCooling) {
      this.mode = 'cooling';
    }
    this.createBars();

    // display the instructions to the student
    let message = '';
    if (this.isHeating()) {
      message = this.heatingClickOnTheMaterialMessage;
    } else if (this.isCooling()) {
      message = this.coolingClickOnTheMaterialMessage;
    }
    this.createTopMessage(message);

    // allow the student to click on a bar
    this.enableGuessing();

    /*
     * If the browser tab loses focus, we will manually set the timers when the
     * simulation completes otherwise the timers may show erroneous times.
     */
    $(window).blur(() => {
      this.blurOccurred = true;
    });
  }

  createBars() {
    const barWidth = 200;
    const barHeight = 18;
    const barX = 140;
    const barYSpacing = 80;
    let barY = 90;
    if (this.barVisbility.metal) {
      this.metalBar = new Bar(
        this,
        this.draw,
        'metal',
        './images/metal.png',
        barWidth,
        barHeight,
        barX,
        barY,
        this.mode
      );
      this.bars.push(this.metalBar);
      barY += barYSpacing;
    }
    if (this.barVisbility.glass) {
      this.glassBar = new Bar(
        this,
        this.draw,
        'glass',
        './images/glass.png',
        barWidth,
        barHeight,
        barX,
        barY,
        this.mode
      );
      this.bars.push(this.glassBar);
      barY += barYSpacing;
    }
    if (this.barVisbility.wood) {
      this.woodBar = new Bar(
        this,
        this.draw,
        'wood',
        './images/wood.png',
        barWidth,
        barHeight,
        barX,
        barY,
        this.mode
      );
      this.bars.push(this.woodBar);
    }
    $('#resetButton, #playPauseButton, #buttonOverlay').css('top', `${barY + 60}px`);
    this.createBottomMessage('', barY + 100);
  }

  /**
   * Get the current state of the simulation.
   * @return a string which can be 'initialized', 'playing', 'paused', or
   * 'completed'
   */
  getState() {
    return this.state;
  }

  /**
   * Set the state of the simulation.
   * @param state a string which can be 'initialized', 'playing', 'paused', or
   * 'completed'
   */
  setState(state: string) {
    this.state = state;
  }

  /**
   * The student has clicked a bar to guess which material heats up the fastest.
   * @param material the name of the material 'metal', 'glass', or 'wood'
   */
  barClicked(material: string) {
    if (this.isGuessingEnabled()) {

      this.setTopMessageColor('black');

      for (let bar of this.bars) {
        bar.hidePredictionBox();

        if (this.isHeating()) {
          bar.setupHeating();
        } else if (this.isCooling()) {
          bar.setupCooling();
        }
      }

      this.controls.enablePlayPauseButton();
      this.controls.enableResetButton();
      if (this.isHeating()) {
        this.setTopMessage(this.heatingClickThePlayButtonMessage);
      } else if (this.isCooling()) {
        this.setTopMessage(this.coolingClickThePlayButtonMessage);
      }
      this.materialClicked = material;
    }
  }

  /**
   * Check if the student is allowed to click on a material.
   */
  isGuessingEnabled() {
    return this.guessingEnabled;
  }

  /**
   * Allow the student to click on a material.
   */
  enableGuessing() {
    this.guessingEnabled = true;
  }

  /**
   * Disallow the student from clicking on a material.
   */
  disableGuessing() {
    this.guessingEnabled = false;
  }

  /**
   * Start playing the simulation.
   */
  play() {
    this.disableGuessing();
    this.setTopMessage('');
    for (let bar of this.bars) {
      bar.resetTimer();
      bar.setTimerColor('black');
      bar.play(this.mode);
    }
    this.setState('playing');
    this.controls.showPauseButton();
  }

  /**
   * Pause the simulation.
   */
  pause() {
    for (let bar of this.bars) {
      bar.pause();
    }
    this.setState('paused');
    this.controls.showPlayButton();
  }

  /**
   * Resume the simulation.
   */
  resume() {
    for (let bar of this.bars) {
      bar.resume();
    }
    this.setState('playing');
    this.controls.showPauseButton();
  }

  /**
   * Reset the simulation back to its initial state.
   */
  reset() {
    for (let bar of this.bars) {
      bar.reset();
    }
    this.setState('initialized');
    this.controls.disablePlayPauseButton();
    this.controls.disableResetButton();
    this.setBottomMessage('');
    if (this.isHeating()) {
      this.setTopMessage(this.heatingClickOnTheMaterialMessage);
    } else if (this.isCooling()) {
      this.setTopMessage(this.coolingClickOnTheMaterialMessage);
    }
    this.enableGuessing();
    this.controls.showPlayButton();
  }

  /**
   * Create the message at the top that displays the instructions at the
   * beginning of the simulation.
   * @param text the text to show in the message
   */
  createTopMessage(text: string) {
    this.topMessage = this.draw.text(text).move(30, 20);
  }

  /**
   * Set the message at the top.
   * @param text the text to show in the message
   */
  setTopMessage(text: string) {
    this.topMessage.text(text);
  }

  /**
   * Set the color of the message at the top.
   * @param text the color of the text which can be a color name or hex string
   */
  setTopMessageColor(color: string) {
    this.topMessage.fill(color);
  }

  /**
   * Create the message at the bottom that displays the results at the end of
   * the simulation.
   * @param text the text to show in the message
   */
  createBottomMessage(text: string, yPos: number) {
    this.bottomMessage = this.draw.text(text).move(30, yPos);
  }

  /**
   * Set the message at the bottom.
   * @param text the text to show in the message
   */
  setBottomMessage(text: string) {
    this.bottomMessage.text(text);
  }

  /**
   * Set the color of the message that shows up at the bottom.
   * @param color the color of the text which can be a color name or hex string
   */
  setBottomMessageColor(color: string) {
    this.bottomMessage.fill(color);
  }

  /**
   * A bar animation has completed.
   * @param material the name of the material 'metal', 'glass', or 'wood'
   */
  barAnimationCompleted(material: string) {
    if (material === this.slowestMaterial) {
      this.animationCompleted();
      this.setState('completed');
    }
  }

  /**
   * The animation has completed.
   */
  animationCompleted() {
    if (this.materialClicked === this.fastestMaterial) {
      this.setBottomMessage(this.getCorrectMessage());
      this.setBottomMessageColor('green');
    } else {
      this.setBottomMessage(this.getIncorrectMessage());
      this.setBottomMessageColor('red');
    }

    if (this.blurOccurred) {
      /*
       * The simulation has lost focus at some point during the simulation so
       * we will manually set the end timers.
       */
      this.metalBar.setTimer(420); // 7 minutes
      this.glassBar.setTimer(660); // 11 minutes
      this.woodBar.setTimer(1140); // 19 minutes
      this.blurOccurred = false;
    }

    this.metalBar.setTimerColor('green');
    this.glassBar.setTimerColor('red');
    this.woodBar.setTimerColor('red');

    this.controls.disablePlayPauseButton();
  }

  getCorrectMessage(): string {
    if (this.mode === 'heating') {
      return `Correct! ${capitalizeFirstLetter(this.fastestMaterial)} heats up the fastest.`;
    } else {
      return `Correct! ${capitalizeFirstLetter(this.fastestMaterial)} cools down the fastest.`;
    }
  }

  getIncorrectMessage(): string {
    if (this.mode === 'heating') {
      return `Incorrect. ${capitalizeFirstLetter(this.materialClicked)} does not heat up the fastest.\n${capitalizeFirstLetter(this.fastestMaterial)} heats up the fastest.`;
    } else {
      return `Incorrect. ${capitalizeFirstLetter(this.materialClicked)} does not cool down the fastest.\n${capitalizeFirstLetter(this.fastestMaterial)} cools down the fastest.`;
    }
  }

  /**
   * Use the url parameters if there are any.
   * @parameters An object containing key/value pairs.
   */
  setParameters(parameters: any) {
    this.setHiddenBars(parameters);
    this.setMode(parameters);
  }

  setHiddenBars(parameters: any) {
    if (parameters.hideBars) {
      const hiddenBars: string[] = parameters.hideBars.split(',');
      hiddenBars.map(value => {
        this.barVisbility[value] = false;
      });
    }
    this.setSlowestMaterial();
    this.setFastestMaterial();
  }

  setSlowestMaterial() {
    if (!this.barVisbility.wood) {
      this.slowestMaterial = 'glass';
      if (!this.barVisbility.glass) {
        this.slowestMaterial = 'metal';
      }
    }
  }

  setFastestMaterial() {
    if (!this.barVisbility.metal) {
      this.fastestMaterial = 'glass';
      if (!this.barVisbility.glass) {
        this.fastestMaterial = 'wood';
      }
    }
  }

  setMode(parameters: any) {
    if (parameters.mode == 'heating') {
      this.allowHeating = true;
    } else if (parameters.mode == 'cooling') {
      this.allowCooling = true;
    }
  }

  isHeating() {
    return this.mode == 'heating';
  }

  isCooling() {
    return this.mode == 'cooling';
  }

  /**
   * The button overlay div was clicked which means the student tried to click
   * on the play or reset button without choosing a material. We will now
   * highlight the top message in red to draw their attention to the directions
   * which tells them they need to choose a material before playing.
   */
  buttonOverlayClicked() {
    this.setTopMessageColor('red');
  }
}
