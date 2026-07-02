const major = Number(process.versions.node.split('.')[0]);

if (major !== 22) {
    console.error(`\nExpo SDK 57 in this project must run on Node 22.x. Current Node: ${process.version}`);
    console.error('Switch Node, then restart Metro:');
    console.error('  nvm install 22.13.1');
    console.error('  nvm use 22.13.1');
    console.error('  node -v');
    console.error('  npm run start -- --clear\n');
    console.error('If nvm is not recognized on Windows, install nvm-windows or install Node 22.13.1 directly, then open a new terminal.\n');
    process.exit(1);
}
