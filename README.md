# Terminal Position Toggle

Move the VS Code terminal panel between right and bottom quickly using commands and keyboard shortcuts.

## Features

- Command palette actions to move the terminal to right or bottom
- Keyboard shortcuts for right, bottom, and toggle actions
- Status bar indicator showing the current terminal position
- Remembers your saved panel size per position and restores it when toggling

## Perfect For

- Users with multiple monitors of different orientations
- Laptop + external monitor setups (especially portrait monitors)
- Portable setups where you resize VS Code frequently

## Installation

### From The Marketplace

Search for `Terminal Position Toggle` in VS Code Extensions, or install with:

```bash
code --install-extension pistos-software.terminal-position-toggle
```

### From Source (Development)

1. Clone or download this extension
2. Run `npm install` in the extension folder
3. Run `npm run compile` to build the extension
4. Press `F5` in VS Code to run in debug mode

### Manual VSIX Installation

1. Build the extension: `npm run compile`
2. Package it: `npm run package`
3. Install the generated `.vsix` file: `code --install-extension terminal-position-toggle-0.1.1.vsix`

## Commands

- `Terminal Position: Move to Right`
- `Terminal Position: Move to Bottom`
- `Terminal Position: Toggle Right/Bottom`

## Default Shortcuts

- `Ctrl+Shift+Alt+R`: Move terminal to right
- `Ctrl+Shift+Alt+B`: Move terminal to bottom
- `Ctrl+Shift+Alt+T`: Toggle terminal position

## Development

```bash
npm install
npm run watch    # Watch for TypeScript changes
npm run compile  # Build the extension
```

### Release process

1. Update `package.json` version (for example, `0.1.2`).
2. Push a matching tag (for example, `v0.1.2`).
3. The workflow builds, packages, uploads the VSIX artifact, and publishes to the Visual Studio Marketplace.

The workflow validates that the tag version matches `package.json` version and fails fast if they differ.

## License

MIT
