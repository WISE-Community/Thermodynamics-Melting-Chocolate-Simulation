import * as $ from 'jquery';

export class Controls {

  playPauseButton: object;
  resetButton: object;

  /**
   * Set up click listeners on the buttons.
   * @param heatingCoolingBarSimulation a reference to the simulation object
   */
  constructor(heatingCoolingBarSimulation: object) {
    this.heatingCoolingBarSimulation = heatingCoolingBarSimulation;

    $('#playPauseButton').on('click', () => {
      if (this.heatingCoolingBarSimulation.getState() == 'initialized') {
        this.heatingCoolingBarSimulation.play();
      } else if (this.heatingCoolingBarSimulation.getState() == 'playing') {
        this.heatingCoolingBarSimulation.pause();
      } else if (this.heatingCoolingBarSimulation.getState() == 'paused') {
        this.heatingCoolingBarSimulation.resume();
      }
    })

    $('#resetButton').on('click', () => {
      this.heatingCoolingBarSimulation.reset();
    })
  }

  /**
   * Show the the play icon on the button.
   */
  showPlayButton() {
    this.setPlayPauseButtonIcon('play_arrow');
  }

  /**
   * Show the pause icon on the button.
   */
  showPauseButton() {
    this.setPlayPauseButtonIcon('pause');
  }

  /**
   * Allow the student to click on the play/pause button.
   */
  enablePlayPauseButton() {
    $('#playPauseButton').prop('disabled', null);
  }

  /**
   * Disallow the student from clicking on the play/pause button.
   */
  disablePlayPauseButton() {
    $('#playPauseButton').prop('disabled', true);
  }

  /**
   * Set the material design icon.
   * @param text The text for the material design icon.
   */
  setPlayPauseButtonIcon(text: string) {
    $('#playPauseButtonIcon').html(text);
  }

  /**
   * The model has been paused.
   */
  modelPaused() {
    this.showPlayButton();
  }

  /**
   * The model is now playing.
   */
  modelPlayed() {
    this.showPauseButton();
  }
}
