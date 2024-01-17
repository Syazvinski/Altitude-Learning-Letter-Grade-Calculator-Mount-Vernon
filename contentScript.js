// contentscript.js
console.log('Grade calculation script is injected and running!');

// Selector for the tooltip content
const tooltipGutsSelector = '.AsTooltip-guts.js-AsTooltip-guts';

// Utility function to get letter grade based on percentage and level
function getLetterGrade(percentage, level) {
  // Round the percentage to handle edge cases like 48.2% which should be rounded down to 48%
  const roundedPercentage = Math.round(percentage);

  const gradeRubric = {
    'AD': [
      { min: 71, grade: 'A+' }
    ],
    'PR': [
      { min: 36, grade: 'A' },
      { min: 0, grade: 'B+' }
    ],
    'EM': [
      { min: 67, grade: 'B' },
      { min: 34, grade: 'C+' },
      { min: 0, grade: 'C' }
    ],
    'NV': { min: 0, grade: 'F' }
  };

  // Determine the correct rubric to use based on the level and percentage
  let correctRubric;
  if (level === 'AD' && roundedPercentage < 71) {
    // If the level is 'AD' but the percentage is below 71, it should be treated as 'PR'
    correctRubric = gradeRubric['PR'];
  } else {
    correctRubric = gradeRubric[level];
  }

  // Check the level and find the corresponding letter grade
  if (Array.isArray(correctRubric)) {
    // Find the entry for which the rounded percentage is greater or equal to the min value
    const entry = correctRubric.find(entry => roundedPercentage >= entry.min);
    return entry ? entry.grade : 'Grade not found';
  } else {
    // If it's not an array, it's a single entry rubric (e.g., 'NV')
    return roundedPercentage >= correctRubric.min ? correctRubric.grade : 'Grade not found';
  }
}

// Function to process the tooltip and calculate the letter grade
function processTooltip(tooltip) {
  const tooltipText = tooltip.textContent.trim();

  const gradeRegex = /^(\d+\.?\d*)% of the way to achieving (AD|PR|EM|NV)$/;
  const match = tooltipText.match(gradeRegex);

  if (match) {
    const percentage = parseFloat(match[1]);
    const level = match[2];
    const letterGrade = getLetterGrade(percentage, level);
    if (letterGrade && letterGrade !== 'Grade not found') {
      // Append the letter grade to the tooltip text
      tooltip.textContent = `${tooltipText} - ${letterGrade} Letter Grade`;
      // Send the letter grade to the background script
      chrome.runtime.sendMessage({ letterGrade: letterGrade });
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