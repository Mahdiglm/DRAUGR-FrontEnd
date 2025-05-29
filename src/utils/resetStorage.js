// Utility function to reset localStorage data
export const resetLocalStorage = () => {
  try {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Set empty cart
    localStorage.setItem('cart', JSON.stringify({ items: [] }));
    
    console.log('localStorage reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting localStorage:', error);
    return false;
  }
};

// Export a function that can be used in the browser console
if (typeof window !== 'undefined') {
  window.resetDraugrStorage = resetLocalStorage;
}

export default resetLocalStorage; 