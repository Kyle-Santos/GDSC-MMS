const Handlebars = require('handlebars');

// Helper to check equality for block expressions
const eqHelper = (a, b, options) => {
    if (a === b) {
        return options.fn(this); // This renders the block if the condition is true
    } else {
        return options.inverse(this); // This renders the else block if the condition is false
    }
};

// Register helper
module.exports = {
    eq: eqHelper,
};