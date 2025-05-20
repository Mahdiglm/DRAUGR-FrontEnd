// manual-deploy.js - An alternative deployment script with authentication
import { publish } from 'gh-pages';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for user credentials
rl.question('GitHub Username: ', (username) => {
  rl.question('GitHub Personal Access Token: ', (token) => {
    rl.close();
    
    const repo = `https://${username}:${token}@github.com/Mahdiglm/DRAUGR-FrontEnd.git`;
    
    console.log('Deploying to GitHub Pages...');
    
    publish('dist', {
      branch: 'gh-pages',
      repo: repo,
      user: {
        name: 'Mahdiglm',
        email: 'mahdiglm@users.noreply.github.com'
      },
      message: 'Auto-generated deployment commit'
    }, (err) => {
      if (err) {
        console.error('Error deploying to GitHub Pages:', err);
        return;
      }
      console.log('Successfully deployed to GitHub Pages!');
    });
  });
}); 