function Game() {
  this.frames = [];
  this.rollType = "";
  this.rollCount = 0;
}

Game.prototype.viewScore = function() {
  var score = 0
  this.frames.forEach(function (frame) {
    score += frame.total
  })
  return score
}

Game.prototype.viewFrames = function() {
  return this.frames;
}

Game.prototype.newFrame = function(roll) {
  if (this._isTenthFrame()) {
    throw new Error("Game Over");
  }

  this.frames.push(new Frame(roll, (this.frames.length + 1)).frame)
  this._addBonus(roll)
  this.rollCount += 1
  if (this._isStrike(this._currentFrame().roll1)) {
    this.rollCount +=1
  }
}

Game.prototype.updateFrame = function(roll) {
  var currentFrame = this._currentFrame()


  if (this._isTenthFrame()) {
    return this._updateTenthFrame(roll)
  }

  if (currentFrame.roll1 === 10) {
    throw new Error("Nice try")
  } else if (currentFrame.total + roll > 10) {
    throw new Error("Nice try")
  }


  currentFrame.roll2 = roll
  currentFrame.total += roll
  this.rollCount += 1

  if (currentFrame.total === 10) {
    currentFrame.type = 'spare'
  }
}

Game.prototype._updateTenthFrame = function(roll) {
  var currentFrame = this._currentFrame()
  var isStrike = this._isStrike(currentFrame.roll1)
  var isSpare = this._isSpare(currentFrame)
  
  if (this.rollCount === 19) {
    currentFrame.roll2 = roll
    currentFrame.total += roll
      if (currentFrame.total === 10) {
        currentFrame.type = 'spare'
      }
  }
  if (this.rollCount === 20 && (isStrike || isSpare)) {
    currentFrame.roll3 = roll
    currentFrame.total += roll
  }

  if (this.rollCount === 20 & currentFrame.total < 10) {
    throw new Error("No bonus for you - game over");
  } 

  this.rollCount += 1
}

Game.prototype._addBonus = function(roll) {
  var previousFrame = this._previousFrame().type
  var twoFramesPrior = this._twoFramesPrior().type
  if (previousFrame === 'spare' || previousFrame === 'strike') {
    this._previousFrame().total += roll
  }

  if (twoFramesPrior === 'strike') {
    this._twoFramesPrior().total += roll
  }
}

Game.prototype._isStrike = function(roll) {
  return roll === 10
}

Game.prototype._isSpare = function(frame) {
  return frame.total === 10
}

Game.prototype._rollType = function(roll) {
  if (this._isStrike(roll)) {
    return "strike"
  } else if (this._currentFrame.roll1 + roll) {
    return "spare"
  } else {
    return ""
  }
}

Game.prototype._currentFrame = function() {
  return this.frames[this.frames.length - 1]
}

Game.prototype._previousFrame = function() {
  var frame = this.frames[this.frames.length - 2]
  if (frame === undefined) {
    return ""
  } else {
    return frame
  }
}

Game.prototype._twoFramesPrior = function() {
  var frame = this.frames[this.frames.length - 3]
  if (frame === undefined) {
    return ""
  } else {
    return frame
  }
}

Game.prototype._isTenthFrame = function () {
  return this.frames.length === 10
}
