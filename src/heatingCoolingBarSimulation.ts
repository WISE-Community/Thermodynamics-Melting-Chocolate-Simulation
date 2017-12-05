import { Bar } from './bar';
import { Controls } from './controls';
import { parseURLParameters } from "./util";
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
  metalBar: any;
  glassBar: any;
  woodBar: any;

  // an array containing all the bars
  bars: any;

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
  heatingCorrectMetalMessage: string = 'Correct! Metal heats up the fastest.';
  heatingIncorrectGlassMessage: string = 'Incorrect! Glass does not heat up the fastest.\nMetal heats up the fastest.';
  heatingIncorrectWoodMessage: string = 'Incorrect! Wood does not heat up the fastest.\nMetal heats up the fastest.';

  // the messages we will show to the student
  coolingClickOnTheMaterialMessage: string = 'Click on the material that you think will cool down the fastest.';
  coolingClickThePlayButtonMessage: string = 'Click the Play button to start cooling down the bars.';
  coolingCorrectMetalMessage: string = 'Correct! Metal cools down the fastest.';
  coolingIncorrectGlassMessage: string = 'Incorrect! Glass does not cool down the fastest.\nMetal cools down the fastest.';
  coolingIncorrectWoodMessage: string = 'Incorrect! Wood does not cool down the fastest.\nMetal cools down the fastest.';

  // whether the simulation can run in heating mode
  allowHeating: boolean;

  // whether the simulation can run in cooling mode
  allowCooling: boolean;

  //
  mode: string;

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

    let barWidth = 200;
    let barHeight = 18;
    let barX = 140;
    let barY = 80;
    let barYSpacing = 70;
    let textX = 40;

    // create the three bars
    this.metalBar = new Bar(this,
        this.draw,
        'metal',
        './images/metal.png',
        barWidth,
        barHeight,
        barX,
        barY,
        this.mode);
    this.glassBar = new Bar(this,
        this.draw,
        'glass',
        './images/glass.png',
        barWidth,
        barHeight,
        barX,
        barY + barYSpacing,
        this.mode);
    this.woodBar = new Bar(this,
        this.draw,
        'wood',
        './images/wood.png',
        barWidth,
        barHeight,
        barX,
        barY + (barYSpacing * 2),
        this.mode);

    this.bars = [
      this.metalBar,
      this.glassBar,
      this.woodBar
    ];

    // display the instructions to the student
    let message = '';
    if (this.isHeating()) {
      message = this.heatingClickOnTheMaterialMessage;
    } else if (this.isCooling()) {
      message = this.coolingClickOnTheMaterialMessage;
    }
    this.createTopMessage(message);
    this.createBottomMessage('');

    // allow the student to click on a bar
    this.enableGuessing();
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

      for (let bar of this.bars) {
        bar.hideCheckMark();

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
   * Create the message at the bottom that displays the results at the end of
   * the simulation.
   * @param text the text to show in the message
   */
  createBottomMessage(text: string) {
    this.bottomMessage = this.draw.text(text).move(30, 320);
  }

  /**
   * Set the message at the top.
   * @param text the text to show in the message
   */
  setTopMessage(text: string) {
    this.topMessage.text(text);
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
    if (material == 'wood') {
      /*
       * the wood material is the last to complete which means the whole
       * simulation is now completed
       */
      this.animationCompleted();
      this.setState('completed');
    }
  }

  /**
   * The animation has completed.
   */
  animationCompleted() {
    if (this.isHeating()) {
      if (this.materialClicked == 'metal') {
        this.setBottomMessage(this.heatingCorrectMetalMessage);
        this.setBottomMessageColor('green');
      } else if (this.materialClicked == 'glass') {
        this.setBottomMessage(this.heatingIncorrectGlassMessage);
        this.setBottomMessageColor('red');
      } else if (this.materialClicked == 'wood') {
        this.setBottomMessage(this.heatingIncorrectWoodMessage);
        this.setBottomMessageColor('red');
      }
    } else if (this.isCooling()) {
      if (this.materialClicked == 'metal') {
        this.setBottomMessage(this.coolingCorrectMetalMessage);
        this.setBottomMessageColor('green');
      } else if (this.materialClicked == 'glass') {
        this.setBottomMessage(this.coolingIncorrectGlassMessage);
        this.setBottomMessageColor('red');
      } else if (this.materialClicked == 'wood') {
        this.setBottomMessage(this.coolingIncorrectWoodMessage);
        this.setBottomMessageColor('red');
      }
    }

    this.metalBar.setTimerColor('green');
    this.glassBar.setTimerColor('red');
    this.woodBar.setTimerColor('red');

    this.controls.disablePlayPauseButton();
  }

  /**
   * Use the url parameters if there are any.
   * @parameters An object containing key/value pairs.
   */
  setParameters(parameters: object) {
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
}
