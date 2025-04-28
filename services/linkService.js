// services/linkService.js
const WebsiteSettings = require('../models/WebsiteSettings');

/**
 * Get the formatted link for the specified checkpoint and destination URL
 * @param {number} checkpoint - Checkpoint number (1, 2, or 3)
 * @param {string} destinationUrl - The target URL to redirect to
 * @returns {Promise<string>} - The formatted redirect URL
 */
exports.getRedirectLink = async (checkpoint, destinationUrl) => {
  try {
    // Get website settings
    const settings = await WebsiteSettings.findOne({});
    if (!settings) {
      throw new Error('Website settings not found');
    }

    // Determine which checkpoint configuration to use
    let checkpointConfig;
    let providerType;
    
    switch (checkpoint) {
      case 1:
        checkpointConfig = settings.checkpoint1;
        break;
      case 2:
        checkpointConfig = settings.checkpoint2;
        break;
      case 3:
        checkpointConfig = settings.checkpoint3;
        break;
      default:
        throw new Error('Invalid checkpoint number');
    }

    // Get provider type
    providerType = checkpointConfig.provider;

    // Return direct link if provider is set to 'none'
    if (providerType === 'none') {
      return destinationUrl;
    }

    // Build the redirect link based on provider type
    let providerId;
    let redirectUrl;

    switch (providerType) {
      case 'linkvertise':
        // Get Linkvertise ID for this checkpoint
        providerId = checkpointConfig.linkvertiseId || settings.linkvertiseId;
          
        // Build Linkvertise URL
        redirectUrl = `https://linkvertise.com/${providerId}/checkpoint-${checkpoint}?o=1&r=${encodeURIComponent(destinationUrl)}`;
        break;
        
      case 'workink':
        // Get Work.ink ID for this checkpoint
        providerId = checkpointConfig.workinkId || settings.workinkId;
          
        // Build Work.ink URL
        redirectUrl = `https://work.ink/${providerId}/checkpoint-${checkpoint}?url=${encodeURIComponent(destinationUrl)}`;
        break;
        
      case 'lootlab':
        // Get Lootlab ID for this checkpoint
        providerId = checkpointConfig.lootlabId || settings.lootlabId;
          
        // Build Lootlab URL
        redirectUrl = `https://lootlab.io/redirect/${providerId}/checkpoint-${checkpoint}?url=${encodeURIComponent(destinationUrl)}`;
        break;
        
      default:
        // Fallback to direct URL if provider type is unknown
        redirectUrl = destinationUrl;
    }

    return redirectUrl;
  } catch (error) {
    console.error('Error generating redirect link:', error);
    // Return the original URL if there's an error
    return destinationUrl;
  }
};