import { Bar } from './bar';
import { Controls } from './controls';
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
  clickOnTheMaterialMessage: string = 'Click on the material that you think will heat up the fastest.';
  clickThePlayButtonMessage: string = 'Click the Play button to start heating up the bars.';
  correctMetalMessage: string = 'Correct! Metal conducts heat the fastest.';
  incorrectGlassMessage: string = 'Incorrect! Glass does not conduct heat the fastest.\nMetal conducts heat the fastest.';
  incorrectWoodMessage: string = 'Incorrect! Wood does not conduct heat the fastest.\nMetal conducts heat the fastest.';

  /**
   * Initialize the simulation.
   */
  constructor() {
    this.setState('initialized');

    // handles the play/pause and reset buttons
    this.controls = new Controls(this);

    // disable the play/pause button until the student has chosen a material
    this.controls.disablePlayPauseButton();

    this.draw = SVG('model');

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
        textX);
    this.glassBar = new Bar(this,
        this.draw,
        'glass',
        './images/glass.png',
        barWidth,
        barHeight,
        barX,
        barY + barYSpacing,
        textX);
    this.woodBar = new Bar(this,
        this.draw,
        'wood',
        './images/wood.png',
        barWidth,
        barHeight,
        barX,
        barY + (barYSpacing * 2),
        textX);

    this.bars = [
      this.metalBar,
      this.glassBar,
      this.woodBar
    ];

    // display the instructions to the student
    this.createTopMessage(this.clickOnTheMaterialMessage);
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
  setState(state) {
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
        bar.showIron();
        bar.showCups();
      }

      this.controls.enablePlayPauseButton();
      this.setTopMessage(this.clickThePlayButtonMessage);
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
    for (let bar of this.bars) {
      bar.play();
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
    this.setBottomMessage('');
    this.setTopMessage(this.clickOnTheMaterialMessage);
    this.enableGuessing();
    this.controls.showPlayButton();
  }

  /**
   * Create the message at the top that displays the instructions at the
   * beginning of the simulation.
   * @param text the text to show in the message
   */
  createTopMessage(text) {
    this.topMessage = this.draw.text(text).move(30, 20);
  }

  /**
   * Create the message at the bottom that displays the results at the end of
   * the simulation.
   * @param text the text to show in the message
   */
  createBottomMessage(text) {
    this.bottomMessage = this.draw.text(text).move(30, 320);
  }

  /**
   * Set the message at the top.
   * @param text the text to show in the message
   */
  setTopMessage(text) {
    this.topMessage.text(text);
  }

  /**
   * Set the message at the bottom.
   * @param text the text to show in the message
   */
  setBottomMessage(text) {
    this.bottomMessage.text(text);
  }

  /**
   * A bar animation has completed.
   * @param material the name of the material 'metal', 'glass', or 'wood'
   */
  barAnimationCompleted(material) {
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
    if (this.materialClicked == 'metal') {
      this.setBottomMessage(this.correctMetalMessage);
    } else if (this.materialClicked == 'glass') {
      this.setBottomMessage(this.incorrectGlassMessage);
    } else if (this.materialClicked == 'wood') {
      this.setBottomMessage(this.incorrectWoodMessage);
    }
    this.setTopMessage('');
    this.controls.disablePlayPauseButton();
  }
}
