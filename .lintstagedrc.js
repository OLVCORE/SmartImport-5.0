module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{css,scss,md,json}': [
    'prettier --write',
  ],
} 