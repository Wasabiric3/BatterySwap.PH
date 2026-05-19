module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "git add",
    "npm --prefix frontend test --silent -- --findRelatedTests --passWithNoTests"
  ],
  "**/*.{json,css,md}": [
    "prettier --write",
    "git add"
  ]
};
