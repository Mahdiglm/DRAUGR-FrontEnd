// A simpler deployment script that doesn't require user input
import { publish } from 'gh-pages';

console.log('🚀 Starting deployment to GitHub Pages...');

publish('dist', {
  branch: 'gh-pages',
  repo: 'https://github.com/Mahdiglm/DRAUGR-FrontEnd.git',
  user: {
    name: 'Mahdiglm',
    email: 'mahdiglm@users.noreply.github.com'
  },
  message: 'Auto-generated deployment commit',
  dotfiles: true,
  silent: false
}, (err) => {
  if (err) {
    console.error('❌ Error deploying to GitHub Pages:', err);
    return;
  }
  console.log('✅ Successfully deployed to GitHub Pages!');
}); 