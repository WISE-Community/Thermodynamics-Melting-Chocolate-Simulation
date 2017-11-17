
var draw = null;
var arr = [];
var arrTop = [];
var arrBot = [];
var submission = [];
var click1 = false;
var selection1 = null;
var selection2 = null;
var startButtonBool = false;
var resetButtonBool = false;
var drawArrow2Bool = false;

var metal = null;
var metalText = null;
var glass = null;
var glassText = null;
var wood = null;
var woodText = null;
var metal2 = null;
var metalText2 = null;
var glass2 = null;
var glassText2 = null;
var wood2 = null;
var woodText2 = null;

var selectMaterialWidth = 150;
var selectMaterialHeight = 18;

var animationMaterialWidth = 300;
var animationMaterialHeight = 40;
var animationMaterialX = 80;
var animationMaterial1Y = 30;

var selectBarSecondYSpacing = 200;

var firstChocolateTimer = 0;
var secondChocolateTimer = 0;

function init() {
  draw = SVG('board');
  arr = [];
  arrTop = [];
  arrBot = [];
  submission = [];
  click1 = false;
  startButtonBool = false;
  resetButtonBool = false;
  drawArrow2Bool = false;

  selectBarX = 180;
  selectBarY = 80;
  selectBarYSpacing = 30;

  textXSpacing = 20;

  drawStartButton();
  drawResetButton();


  <!-- ----------------GROUP 1-------------------- -->
  metal = draw.image('./img/metal.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY
  }).click(function() {
    selectFirstMaterial('metal')
  }).addClass('clickable');
  //metalText = draw.text('Metal').x(340).y(170);
  metalText = draw.text('Metal').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY);

  glass = draw.image('./img/glass.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY + selectBarYSpacing
  }).click(function() {
    selectFirstMaterial('glass');
  }).addClass('clickable');
  glassText = draw.text('Glass').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY + selectBarYSpacing);

  wood = draw.image('./img/wood.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY + (selectBarYSpacing * 2)
  }).click(function() {
    selectFirstMaterial('wood');
  }).addClass('clickable');
  woodText = draw.text('Wood').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY + (selectBarYSpacing * 2));

  drawArrow1();
  drawFirstChocolateTimer();
  <!-- ------------------------------------------- -->

  <!-- ----------------GROUP 2-------------------- -->
  metal2 = draw.image('./img/metal.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY + selectBarSecondYSpacing,
    'bottom': true
  }).click(function() {
    selectSecondMaterial('metal')
  }).addClass('clickable');
  metalText2 = draw.text('Metal').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY + selectBarSecondYSpacing);

  glass2 = draw.image('./img/glass.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY + selectBarSecondYSpacing + (selectBarYSpacing * 1),
    'bottom': true
  }).click(function() {
    selectSecondMaterial('glass')
  }).addClass('clickable');
  glassText2 = draw.text('Glass').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY + selectBarSecondYSpacing + (selectBarYSpacing * 1));

  wood2 = draw.image('./img/wood.png', selectMaterialWidth, selectMaterialHeight).attr({
    'x': selectBarX,
    'y': selectBarY + selectBarSecondYSpacing + (selectBarYSpacing * 2),
    'bottom': true
  }).click(function() {
    selectSecondMaterial('wood')
  }).addClass('clickable');
  woodText2 = draw.text('Wood').x(selectBarX + selectMaterialWidth + textXSpacing).y(selectBarY + selectBarSecondYSpacing + (selectBarYSpacing * 2));

  drawSecondChocolateTimer();
  <!-- ------------------------------------------- -->
}


//selects the type of material and draws it on the screen
function selectFirstMaterial(material) {
  //removes the plank/iron if it has already been drawn
  if (typeof plank !== 'undefined') {
    plank.remove();
    iron.remove();
  }
  //resets if the start button has been pressed
  // if (startButtonBool === true) {
  //   drawStartButton();
  //   stopAnim();
  // }
  arrow.remove()
  arrowText.remove();
  click1 = true;
  setSelection1(material);
  plank = draw.image('./img/' + material + '.png', animationMaterialWidth, animationMaterialHeight).attr({
    'x': animationMaterialX,
    'y': animationMaterial1Y
  })
  arr.push(plank);
  iron = draw.image('./img/iron.png', 50, 50).attr({
    'x': 15,
    'y': 30
    });
  drawArrow2();
}

function setSelection1(material) {
  let num = 0;

  if (material == 'metal') {
    num = 1;
  } else if (material == 'glass') {
    num = 2;
  } else if (material == 'wood') {
    num = 3;
  }

  selection1 = num;
  submission[0] = num;
}

function setSelection2(material) {
  let num = 0;

  if (material == 'metal') {
    num = 1;
  } else if (material == 'glass') {
    num = 2;
  } else if (material == 'wood') {
    num = 3;
  }

  selection2 = num;
  submission[1] = num;
}

function selectSecondMaterial(material) {
  //cannot select bottom material until top material has been selected
  if (click1 === false) {
    return;
  }
  //removes the plank/iron if it has already been drawn
  if (typeof plank2 !== 'undefined') {
    plank2.remove();
    iron2.remove();
  }
  if (startButtonBool === true) {
    stopAnim();
  }
  arrow2.remove()
  arrowText2.remove();
  showStartButton();
  setSelection2(material);
  plank2 = draw.image('./img/' + material + '.png', animationMaterialWidth, animationMaterialHeight).attr({
    'x': animationMaterialX,
    'y': animationMaterial1Y + selectBarSecondYSpacing
  })
  arr.push(plank2);
  iron2 = draw.image('./img/iron.png', 50, 50).attr({
  'x': 15,
  'y': selectBarSecondYSpacing + 30
  });
}

//begins start animations
function startAnim() {
  if (typeof chip !== 'undefined') {
    removeChips();
  }
  //makes start button unclickable during duration of animation
  startButtonIcon.click('null')
  //draws iron and then starts heat animation
  drawIron();
  heatAnim();
}

function heatAnim() {
  //calls function that draws the heat and chocolate chips
  drawHeat();
  //finds which of the the two materials selected is the slower one
  maxArr = submission.slice(0, 2)
  maxIndex = maxArr.indexOf(Math.max(...maxArr));
  //heat animation for top material, runs chocolate animation after
  rect1.animate(selection1 * 3000 + 3000, 'quadIn').attr({
    'width': 400
  }).after(animateFirstChocolateMelting).duringAll((pos) => {
    updateFirstChocolateTimer();
  });
  //heat animation for bottom material, runs chocolate animation after
  rect2.animate(selection2 * 3000 + 3000, 'quadIn').attr({
    'width': 400
  }).after(animateSecondChocolateMelting).duringAll((pos) => {
    updateSecondChocolateTimer();
  });
}

function poopAnim0(num, bool) {
  if (num === 1) {
    firstMaterialChocolateNotMelted.animate(2000).opacity(0);
    setTimeout(function() {
      firstMaterialChocolateHalfMelted.animate(1000).opacity(1).after(function() {
        firstMaterialChocolateHalfMelted.animate(1500).opacity(0);
      })
    }, 1000);
    setTimeout(function() {
      firstMaterialChocolateMelted.animate(1000).opacity(1);
    }, 2600);
    if (bool) {
      setTimeout(function() {
        startButtonIcon.click(function() {
          startButtonBool = true;
          submission[2] = new Date().toLocaleString();
          console.log(submission);
          log();
          startAnim();
        })
      }, 4000);
    }
  } else {
    secondMaterialChocolateNotMelted.animate(2000).opacity(0);
    setTimeout(function() {
      secondMaterialChocolateHalfMelted.animate(1000).opacity(1).after(function() {
        secondMaterialChocolateHalfMelted.animate(1500).opacity(0);
      })
    }, 1000);
    setTimeout(function() {
      secondMaterialChocolateMelted.animate(1000).opacity(1);
    }, 2600);
    if (bool) {
      setTimeout(function() {
        startButtonIcon.click(function() {
          startButtonBool = true;
          submission[2] = new Date().toLocaleString();
          console.log(submission);
          log();
          startAnim();
        })
      }, 4000);
    }
  }
}

function stopAnim() {
  var chips = [rect1,
      rect2,
      firstMaterialChocolateNotMelted,
      firstMaterialChocolateHalfMelted,
      firstMaterialChocolateMelted,
      secondMaterialChocolateNotMelted,
      secondMaterialChocolateHalfMelted,
      secondMaterialChocolateMelted];
  for (var i = 0 ; i < chips.length; i++) {
    chips[i].remove();
  }
}

function reset() {
  click1 = false;
  startButtonBool = false;
  drawArrow2Bool = false;
  resetButtonBool = false;
  for (var i = 0; i < arr.length; i ++) {
    arr[i].stop();
    arr[i].remove();
  }

  drawArrow1();
}

function drawStartButton() {
  if (startButtonBool === false) {
    startButtonText = draw.text('Start').x(458).y(178).font({size: 25});
    startButtonIcon = draw.rect(150,50).x(410).y(170).radius(15).fill('white').stroke({width:2}).opacity(1).attr({
      'fill-opacity': 0
    }).addClass('clickable');
    arr.push(startButtonIcon, startButtonText);
  }
  startButtonIcon.click(function() {
    startButtonBool = true;
    submission[2] = new Date().toLocaleString();
    console.log(submission);
    startAnim();
    hideStartButton();
    showResetButton();
  })

  hideStartButton();
}

function showStartButton() {
  startButtonText.show();
  startButtonIcon.show();
}

function hideStartButton() {
  startButtonText.hide();
  startButtonIcon.hide();
}

function drawResetButton() {
  if (resetButtonBool === false) {
    resetButtonText = draw.text('Reset').x(453).y(178).font({size: 25});
    resetButtonIcon = draw.rect(150,50).x(410).y(170).radius(15).fill('white').stroke({width:2}).opacity(1).attr({
      'fill-opacity': 0
    }).addClass('clickable');
    resetButtonBool = true;
    arr.push(resetButtonIcon, resetButtonText);
  }
  resetButtonIcon.click(function() {
    reset();
  })

  hideResetButton();
}

function showResetButton() {
  resetButtonText.show();
  resetButtonIcon.show();
}

function hideResetButton() {
  resetButtonText.hide();
  resetButtonIcon.hide();
}

function drawArrow1() {
  arrow = draw.image('./img/arrow.png', 140, 140).attr({
    'x': 20,
    'y': 50
  });
  arrowText = draw.text('Click on a\nmaterial').font({ size: 16 }).x(35).y(102);
}

function drawArrow1x() {
  arrow = draw.image('./img/arrow.png', 310, 120).attr({
    'x': 560,
    'y': 50
  })
  arrowText = draw.text('Click on the first material you\n chose for your prediction').x(635).y(65)
      .font({
        family: 'Arial',
        size: 15,
        weight: 'bold'
      });
}

function drawArrow2() {
  arrow2 = draw.image('./img/arrow.png', 140, 140).attr({
    'x': 20,
    'y': 250
  });
  arrowText2 = draw.text('Click on a\ndifferent\nmaterial').font({ size: 16 }).x(35).y(292);
}

function drawArrow2x() {
  if (drawArrow2Bool === false) {
    arrow2 = draw.image('./img/arrow.png', 310, 120).attr({
      'x': 560,
      'y': 350
      })
    arrowText2 = draw.text('Click on the second material you\n chose for your prediction').x(628).y(365)
      .font({
        family: 'Arial',
        size: 15,
        weight: 'bold'
      });
  }
  drawArrow2Bool = true;
}

function drawIron() {
  iron.back();
  iron.attr({
    'x': 40,
    'y': 30
  })
  iron2.back();
  iron2.attr({
    'x': 40,
    'y': selectBarSecondYSpacing + 30
  })
  arr.push(iron);
  arr.push(iron2);
}

function drawHeat() {
  if (typeof rect1 !== 'undefined') {
    rect1.remove();
    rect2.remove();
  }
  var mask = draw.polygon('130,122 130,100 150,90 525,90 525,114 515,122').fill('white');
  var mask2 = draw.polygon('130,422 130,400 150,390 525,390 525,414 515,422').fill('white');
  mask.width(animationMaterialWidth - 2).height(animationMaterialHeight - 17);
  mask.x(animationMaterialX).y(animationMaterial1Y + 8);
  rect1 = draw.rect(5, 35).attr({
    'x': animationMaterialX,
    'y': animationMaterial1Y
  }).opacity(.3).fill('red')
  rect1.maskWith(mask);


  mask2.width(animationMaterialWidth - 2).height(animationMaterialHeight - 17);
  mask2.x(animationMaterialX).y(animationMaterial1Y + selectBarSecondYSpacing + 8);
  rect2 = draw.rect(5, 35).attr({
    'x': animationMaterialX,
    'y': animationMaterial1Y + selectBarSecondYSpacing
  }).opacity(.3).fill('red')
  rect2.maskWith(mask2);

  let chocolateYOffset = 10;
  let chocolateXOffset = animationMaterialWidth - 100;

  firstMaterialChocolateNotMelted = draw.image('./img/chip1.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y - chocolateYOffset
  });

  firstMaterialChocolateHalfMelted = draw.image('./img/chip2.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y - chocolateYOffset,
    'opacity': 0
  });

  firstMaterialChocolateMelted = draw.image('./img/chip3.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y - chocolateYOffset,
    'opacity': 0
  });

  secondMaterialChocolateNotMelted = draw.image('./img/chip1.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y + selectBarSecondYSpacing - chocolateYOffset
  });

  secondMaterialChocolateHalfMelted = draw.image('./img/chip2.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y + selectBarSecondYSpacing - chocolateYOffset,
    'opacity': 0
  });

  secondMaterialChocolateMelted = draw.image('./img/chip3.png', 128, 50).attr({
    'x': animationMaterialX + chocolateXOffset,
    'y': animationMaterial1Y + selectBarSecondYSpacing - chocolateYOffset,
    'opacity': 0
  });
  arr.push(rect1,
      rect2,
      firstMaterialChocolateNotMelted,
      firstMaterialChocolateHalfMelted,
      firstMaterialChocolateMelted,
      secondMaterialChocolateNotMelted,
      secondMaterialChocolateHalfMelted,
      secondMaterialChocolateMelted);
}

function animateFirstChocolateMelting() {
  //var bool = maxIndex === 0;
  //poopAnim(1, bool);
  // if (maxIndex === 0) {
  //   drawStartButton();
  // }

  firstMaterialChocolateNotMelted.animate(1000).opacity(0.5).after(() => {
    firstMaterialChocolateNotMelted.animate(1000).opacity(0);
    firstMaterialChocolateHalfMelted.animate(1000).opacity(1).after(() => {
      firstMaterialChocolateHalfMelted.animate(1000).opacity(0);
      firstMaterialChocolateMelted.animate(1000).opacity(1);
    });
  });
  // firstMaterialChocolateNotMelted.animate(2000).opacity(0);
  // setTimeout(function() {
  //   firstMaterialChocolateHalfMelted.animate(1000).opacity(1).after(function() {
  //     firstMaterialChocolateHalfMelted.animate(1500).opacity(0);
  //   })
  // }, 1000);
  // setTimeout(function() {
  //   firstMaterialChocolateMelted.animate(1000).opacity(1);
  // }, 2600);
  // if (bool) {
  //   setTimeout(function() {
  //     startButtonIcon.click(function() {
  //       startButtonBool = true;
  //       submission[2] = new Date().toLocaleString();
  //       console.log(submission);
  //       log();
  //       startAnim();
  //     })
  //   }, 4000);
  // }
}

function animateSecondChocolateMelting() {
  //var bool = maxIndex === 1;
  //poopAnim(2, bool);
  // if (maxIndex === 1) {
  //   drawStartButton();
  // }

  secondMaterialChocolateNotMelted.animate(1000).opacity(0.5).after(() => {
    secondMaterialChocolateNotMelted.animate(1000).opacity(0);
    secondMaterialChocolateHalfMelted.animate(1000).opacity(1).after(() => {
      secondMaterialChocolateHalfMelted.animate(1000).opacity(0);
      secondMaterialChocolateMelted.animate(1000).opacity(1);
    });
  });
  // setTimeout(function() {
  //   secondMaterialChocolateHalfMelted.animate(1000).opacity(1).after(function() {
  //     secondMaterialChocolateHalfMelted.animate(1500).opacity(0);
  //   })
  // }, 1000);
  // setTimeout(function() {
  //   secondMaterialChocolateMelted.animate(1000).opacity(1);
  // }, 2600);
  // if (bool) {
  //   setTimeout(function() {
  //     startButtonIcon.click(function() {
  //       startButtonBool = true;
  //       submission[2] = new Date().toLocaleString();
  //       console.log(submission);
  //       log();
  //       startAnim();
  //     })
  //   }, 4000);
  // }
}

function removeChips() {
  var chips = [chip, chip1, chip2, chip3, chip4, chip5, rect1, rect2];
  for (var i = 0; i < chips.length; i ++) {
      chips[i].stop();
      chips[i].remove();
  }
}

function startFirstChocolateTimer() {

}

function startSecondChocolateTimer() {

}

function startFirstChocolateTimer() {

}

function startSecondChocolateTimer() {

}

function drawFirstChocolateTimer() {
  firstChocolateTimerText = draw.text(firstChocolateTimer + ' seconds').x(animationMaterialX + animationMaterialWidth + 50).y(animationMaterial1Y + 10);
}

function drawSecondChocolateTimer() {
  secondChocolateTimerText = draw.text(secondChocolateTimer + ' seconds').x(animationMaterialX + animationMaterialWidth + 50).y(selectBarSecondYSpacing + animationMaterial1Y + 10);
}

function updateFirstChocolateTimer() {
  firstChocolateTimer += 1;
  firstChocolateTimerText.text(firstChocolateTimer + ' seconds');
}

function updateSecondChocolateTimer() {
  secondChocolateTimer += 1;
  secondChocolateTimerText.text(secondChocolateTimer + ' seconds');
}

function log() {
  state.messageType = "studentWork";
  state.isAutoSave = false;
  state.isSubmit = false;
  state.studentData = submission;
  saveWISE5State(state);
}

function saveWISE5State(componentState) {
  parent.postMessage(componentState, "*");
}
