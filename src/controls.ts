import * as $ from 'jquery';

export class Controls {

  playPauseButton: object;
  resetButton: object;
  heatingCoolingBarSimulation: HeatingCoolingBarSimulation;

  /**
   * Set up click listeners on the buttons.
   * @param heatingCoolingBarSimulation a reference to the simulation object
   */
  constructor(heatingCoolingBarSimulation: HeatingCoolingBarSimulation) {
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

    /*
     * The button overlay is initally placed over the play and reset buttons so
     * the student can't click on them. Once the student has clicked on a bar
     * to guess which material is the best, we will hide this overlay so that
     * they can click on the play button. We need to do this because there is
     * a minor bug when using font icons inside button elements that make the
     * buttons clickable even when they are disabled.
     */
    $('#buttonOverlay').on('click', () => {
      this.heatingCoolingBarSimulation.buttonOverlayClicked();
    });
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
    $('#playPauseButton').css('cursor', 'pointer');
  }

  /**
   * Disallow the student from clicking on the play/pause button.
   */
  disablePlayPauseButton() {
    $('#playPauseButton').prop('disabled', true);
    $('#playPauseButton').css('cursor', null);
  }

  /**
   * Set the material design icon.
   * @param text The text for the material design icon.
   */
  setPlayPauseButtonIcon(text: string) {
    $('#playPauseButtonIcon').html(text);
  }

  /**
   * Allow the student to click on the reset button.
   */
  enableResetButton() {
    $('#buttonOverlay').hide();
    $('#resetButton').prop('disabled', null);
    $('#resetButton').css('cursor', 'pointer');
  }

  /**
   * Disallow the student from clicking the reset button.
   */
  disableResetButton() {
    $('#buttonOverlay').show();
    $('#resetButton').prop('disabled', true);
    $('#resetButton').css('cursor', null);
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
