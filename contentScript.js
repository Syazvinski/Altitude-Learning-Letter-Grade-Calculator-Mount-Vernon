console.log('Grade calculation script is injected and running!');

// Selector for the tooltip content
const tooltipGutsSelector = '.AsTooltip-guts.js-AsTooltip-guts';

// Grading rubric
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

// Determines the letter grade and the percentage needed for the next grade
function determineLetterGradeAndNext(status, percentage) {
  let currentGrade = undefined;
  let nextGrade = undefined;
  let percentForNextGrade = 0;

  if (status in gradingRubric) {
    for (let gradeInfo of gradingRubric[status]) {
      if (gradeInfo.min_percent <= percentage && percentage <= gradeInfo.max_percent) {
        currentGrade = gradeInfo.letter_grade;
        nextGrade = gradeInfo.next_grade;
        if (nextGrade !== 'Max') {
          // If the next grade is within the current status, calculate the difference to its minimum percent
          percentForNextGrade = gradeInfo.max_percent + 1 - percentage;
        }
        break;
      }
    }
  } else {
    throw new Error("Invalid status code");
  }

  // If the calculated percentage for the next grade is not valid, we need to check the next status level
  if (percentForNextGrade <= 0 || nextGrade === 'A+') {
    // Here, you need to define the logic to handle the transition to the next status
    // For example, if status is 'PR' and next grade is 'A+', you would need to calculate up to 71% of 'AD'
    if (status === 'PR' && nextGrade === 'A+') {
      percentForNextGrade = 71 - percentage;
    }
    // Add similar conditions for other transitions that are not straightforward
  }

  return { currentGrade, nextGrade, percentForNextGrade };
}


// Function to process the tooltip and calculate the letter grade
function processTooltip(tooltip) {
  const tooltipText = tooltip.textContent.trim().split(' - ')[0]; 

  const gradeRegex = /^(\d+\.?\d*)% of the way to achieving (AD|PR|EM|NV)$/;
  const match = tooltipText.match(gradeRegex);

  const levelMapping = {
    'AD': 'PR',
    'PR': 'EM',
    'EM': 'NV',
    'NV': 'NV' // Assuming 'NV' is the lowest level, so it remains the same
  };
  
  if (match) {
    const percentage = parseFloat(match[1]);
    let level = match[2];
    
    // Lower the level only if the percentage is less than 100 and the level is not 'AD' with a percentage above the minimum for 'AD'
    if (percentage < 100 && !(level === 'AD' && percentage >= gradingRubric['AD'][0].min_percent)) {
      level = levelMapping[level] || level; // If the level is not found in the mapping, keep it the same
    }
  
    const roundedPercentage = Math.round(percentage);
    const { currentGrade, nextGrade, percentForNextGrade } = determineLetterGradeAndNext(level, roundedPercentage);

    if (currentGrade) {
      const nextGradeInfo = nextGrade !== 'Max' ? `<br><b>${percentForNextGrade}%</b> more to a ${nextGrade}` : '';
      tooltip.innerHTML = `${tooltipText}<br>Letter Grade: <b>${currentGrade}</b>${nextGradeInfo}`;
    } else {
     
    }
  } else {
    
  }
}

// Options for the observer (which mutations to observe)
const observerOptions = {
  childList: true,
  subtree: true
};

// Callback function to execute when mutations are observed
const observerCallback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        if (node.matches && node.matches(tooltipGutsSelector)) {
          processTooltip(node);
        }
      });
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerCallback);

// Start observing the document body for configured mutations
observer.observe(document.body, observerOptions);