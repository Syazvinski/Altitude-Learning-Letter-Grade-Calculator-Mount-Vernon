// Grade Calculation Script

// Selector for the tooltip content where grades will be displayed
const tooltipGutsSelector = '.AsTooltip-guts.js-AsTooltip-guts';

// Grading rubric defining grade ranges for different statuses
const gradingRubric = {
  'AD': [
    { min_percent: 71, max_percent: 100, letter_grade: 'A+', next_grade: 'Max' },
    { min_percent: 0, max_percent: 70, letter_grade: 'A', next_grade: 'A+' },
  ],
  'PR': [
    { min_percent: 36, max_percent: 100, letter_grade: 'A', next_grade: 'A+' },
    { min_percent: 0, max_percent: 35, letter_grade: 'B+', next_grade: 'A' }
  ],
  'EM': [
    { min_percent: 67, max_percent: 100, letter_grade: 'B', next_grade: 'B+' },
    { min_percent: 34, max_percent: 66, letter_grade: 'C+', next_grade: 'B' },
    { min_percent: 0, max_percent: 33, letter_grade: 'C', next_grade: 'C+' }
  ],
  'NV': [
    { min_percent: 0, max_percent: 99, letter_grade: 'F', next_grade: 'C' }
  ]
};

/**
 * Determines the letter grade and the percentage needed for the next grade.
 * @param {string} status - The current status.
 * @param {number} percentage - The current percentage.
 * @returns An object containing current grade, next grade, and percent for next grade.
 */
function determineLetterGradeAndNext(status, percentage) {
  let currentGrade, nextGrade, percentForNextGrade = 0;

  if (status in gradingRubric) {
    gradingRubric[status].some(gradeInfo => {
      if (gradeInfo.min_percent <= percentage && percentage <= gradeInfo.max_percent) {
        currentGrade = gradeInfo.letter_grade;
        nextGrade = gradeInfo.next_grade;
        if (nextGrade !== 'Max') {
          percentForNextGrade = gradeInfo.max_percent + 1 - percentage;
        }
        return true; // Break the loop
      }
      return false; // Continue the loop
    });
  } else {
    throw new Error("Invalid status code");
  }

  // Logic for transitioning to the next status
  if (percentForNextGrade <= 0 || nextGrade === 'A+') {
    // Example: transitioning from 'PR' to 'AD'
    if (status === 'PR' && nextGrade === 'A+') {
      percentForNextGrade = 71 - percentage;
    }
    // Add additional conditions for other status transitions as needed
  }

  return { currentGrade, nextGrade, percentForNextGrade };
}

/**
 * Processes a tooltip element to calculate and display the letter grade.
 * @param {Element} tooltip - The tooltip DOM element.
 */
function processTooltip(tooltip) {
  const tooltipText = tooltip.textContent.trim().split(' - ')[0]; 
  const gradeRegex = /^(\d+\.?\d*)% of the way to achieving (AD|PR|EM|NV)$/;

  const levelMapping = {
    'AD': 'PR',
    'PR': 'EM',
    'EM': 'NV',
    'NV': 'NV' // Assuming 'NV' is the lowest level
  };

  const match = tooltipText.match(gradeRegex);
  if (match) {
    let [_, percentageStr, level] = match;
    const percentage = parseFloat(percentageStr);

    if (percentage < 100 && !(level === 'AD' && percentage >= gradingRubric['AD'][0].min_percent)) {
      level = levelMapping[level] || level;
    }

    const roundedPercentage = Math.round(percentage);
    const { currentGrade, nextGrade, percentForNextGrade } = determineLetterGradeAndNext(level, roundedPercentage);

    const nextGradeInfo = nextGrade !== 'Max' ? `<br><b>${percentForNextGrade}%</b> more to a ${nextGrade}` : '';
    tooltip.innerHTML = `${tooltipText}<br>Letter Grade: <b>${currentGrade}</b>${nextGradeInfo}`;
  }
}

// Configuration for the observer (which mutations to observe)
const observerOptions = {
  childList: true,
  subtree: true
};

/**
 * Callback function to execute when mutations are observed.
 * This function will process any added tooltip nodes.
 */
const observerCallback = function(mutationsList, observer) {
  mutationsList.forEach(mutation => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach(node => {
        if (node.matches && node.matches(tooltipGutsSelector)) {
          processTooltip(node);
        }
      });
    }
  });
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerCallback);

// Start observing the document body for configured mutations
observer.observe(document.body, observerOptions);
