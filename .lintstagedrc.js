module.exports = {
    // Type check TypeScript files. --noEmit added to disable emitting files from a compilation.
    "**/*.(ts|tsx)": () => "npx tsc --noEmit",

    // Lint & Prettify TS and JS files
    "**/*.(ts|tsx|js)": filenames => [
        `npx eslint ${filenames.join(" ")}`,
        `npx prettier --write ${filenames.join(" ")}`,
    ],

    // Prettify only Markdown and JSON files
    "**/*.(css|md|json)": filenames => `npx prettier --write ${filenames.join(" ")}`,
};
