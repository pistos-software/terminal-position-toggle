import * as vscode from 'vscode';

interface PanelSizeState {
    rightSize?: number;
    bottomSize?: number;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Terminal Position Toggle activated');

    let statusBarItem: vscode.StatusBarItem;

    // Create status bar item to show current position
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'terminalPositionToggle.toggle';
    statusBarItem.tooltip = 'Click to toggle terminal position (or use Ctrl+Shift+Alt+T)';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const getPanelSizeState = (): PanelSizeState => {
        return context.globalState.get('panelSizeState', {});
    };

    const setPanelSizeState = (state: PanelSizeState) => {
        return context.globalState.update('panelSizeState', state);
    };

    const getCurrentPosition = (): 'bottom' | 'right' => {
        const config = vscode.workspace.getConfiguration('workbench.panel');
        return (config.get('defaultLocation') as 'bottom' | 'right') || 'bottom';
    };

    const updateStatusBar = () => {
        const position = getCurrentPosition();
        statusBarItem.text = `$(arrow-${position === 'right' ? 'right' : 'down'}) Terminal: ${position}`;
    };

    const savePanelSize = async (position: 'bottom' | 'right') => {
        const config = vscode.workspace.getConfiguration('workbench.panel');
        const currentSize = config.get('size');

        if (typeof currentSize === 'number' && currentSize > 0) {
            const state = getPanelSizeState();
            if (position === 'right') {
                state.rightSize = currentSize;
            } else {
                state.bottomSize = currentSize;
            }
            await setPanelSizeState(state);
            console.log(`Saved ${position} panel size: ${currentSize}px`);
        }
    };

    const restorePanelSize = async (position: 'bottom' | 'right') => {
        const state = getPanelSizeState();
        let sizeToRestore: number | undefined;

        if (position === 'right') {
            sizeToRestore = state.rightSize;
        } else {
            sizeToRestore = state.bottomSize;
        }

        if (sizeToRestore && sizeToRestore > 0) {
            const config = vscode.workspace.getConfiguration('workbench.panel');
            const target = vscode.workspace.workspaceFolders ?
                vscode.ConfigurationTarget.Workspace :
                vscode.ConfigurationTarget.Global;

            await config.update('size', sizeToRestore, target);
            console.log(`Restored ${position} panel size: ${sizeToRestore}px`);
        }
    };

    const setTerminalPosition = async (position: 'bottom' | 'right') => {
        const currentPos = getCurrentPosition();

        if (currentPos === position) {
            console.log(`Terminal already in ${position} position`);
            return;
        }

        // Save the size of the position we're leaving
        await savePanelSize(currentPos);

        // Update the panel position
        const config = vscode.workspace.getConfiguration('workbench.panel');
        const target = vscode.workspace.workspaceFolders ?
            vscode.ConfigurationTarget.Workspace :
            vscode.ConfigurationTarget.Global;

        await config.update('defaultLocation', position, target);

        // Move the currently visible panel immediately.
        if (position === 'right') {
            await vscode.commands.executeCommand('workbench.action.positionPanelRight');
        } else {
            await vscode.commands.executeCommand('workbench.action.positionPanelBottom');
        }

        // Restore the saved size for this position
        await restorePanelSize(position);

        updateStatusBar();
        vscode.window.showInformationMessage(`Terminal moved to ${position}`);
        console.log(`Terminal position changed to: ${position}`);
    };

    const toggleTerminalPosition = async () => {
        const currentPos = getCurrentPosition();
        const newPos = currentPos === 'right' ? 'bottom' : 'right';
        await setTerminalPosition(newPos);
    };

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('terminalPositionToggle.setRight', async () => {
            await setTerminalPosition('right');
        }),
        vscode.commands.registerCommand('terminalPositionToggle.setBottom', async () => {
            await setTerminalPosition('bottom');
        }),
        vscode.commands.registerCommand('terminalPositionToggle.toggle', async () => {
            await toggleTerminalPosition();
        })
    );

    // Initialize status bar
    updateStatusBar();
}

export function deactivate() {
    console.log('Terminal Position Toggle deactivated');
}
