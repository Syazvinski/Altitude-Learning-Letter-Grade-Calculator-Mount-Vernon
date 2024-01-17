## Grade Calculation Browser Extension

Developed by Stephan Yazvinski, this extension is designed to enhance your browsing experience by injecting a grade calculation script into web pages, efficiently calculating and displaying letter grades based on percentage scores and predefined academic levels.

### Features

- **Automatic Grade Calculation:** Converts percentage scores to letter grades (e.g., A+, B, C).
- **Dynamic Content Handling:** Works with web pages that dynamically load content.
- **Customizable Rubric:** Supports different grading criteria based on academic levels.

### Installation

#### From Chrome Web Store
1. Visit the [Chrome Web Store page](https://chromewebstore.google.com/detail/mount-vernon-school-altit/npejnoaeodlhhllfjdnddllhlegapdeg?hl=en).
2. Click "Add to Chrome" to install.

#### Manual Installation
1. Download the extension package.
2. Open your browser's extension management page (usually found in settings).
3. Enable "Developer mode" (if not already enabled).
4. Click on "Load unpacked" and select the downloaded extension folder.

### Usage

Once installed, the extension automatically activates on web pages that contain the specified elements. Hover over the relevant content to view the updated tooltip with the calculated letter grade.

### Official Website

For more information and updates, visit the [official website](https://altitudegradecalculator.com/).

### Script Overview

- **contentscript.js:** Main script that includes:
  - Function to inject the grade calculation script.
  - Utility functions for calculating letter grades based on custom rubrics.
  - Mutation observer to monitor and react to changes in the DOM.
  - Logic to append calculated grades to tooltips.

### Customization

The grading rubric is defined in the `getLetterGrade` function. Modify this function to suit different grading schemes.

### Contributions

Contributions to this project are welcome. Please follow the standard GitHub pull request process to submit your changes.

### License

This project is licensed under the MIT License. This license allows for free use, modification, and distribution, but requires that credit is given to the original author, Stephan Yazvinski. See the LICENSE file for more details.

### Support and Contact

For support or to report issues, please raise an issue on the GitHub repository or contact Stephan Yazvinski at [syazvinski@gmail.com](mailto:syazvinski@gmail.com).
