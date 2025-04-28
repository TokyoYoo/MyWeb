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
        providerType = settings.checkpoint1Api;
        break;
      case 2:
        checkpointConfig = settings.checkpoint2;
        providerType = settings.checkpoint2Api;
        break;
      case 3:
        checkpointConfig = settings.checkpoint3;
        providerType = settings.checkpoint3Api;
        break;
      default:
        throw new Error('Invalid checkpoint number');
    }

    // If using the new schema structure
    if (checkpointConfig && checkpointConfig.provider) {
      providerType = checkpointConfig.provider;
    }

    // Return direct link if provider is set to 'none'
    if (providerType === 'none') {
      return destinationUrl;
    }

    // Build the redirect link based on provider type
    let providerId;
    let redirectUrl;

    switch (providerType) {
      case 'linkvertise':
        // Get Linkvertise ID (checkpoint specific or default)
        providerId = checkpointConfig && checkpointConfig.linkvertiseId && checkpointConfig.linkvertiseId.trim() !== '' 
          ? checkpointConfig.linkvertiseId 
          : settings.linkvertiseId;
          
        // Build Linkvertise URL
        redirectUrl = `https://linkvertise.com/${providerId}/checkpoint-${checkpoint}?o=1&r=${encodeURIComponent(destinationUrl)}`;
        break;
        
      case 'workink':
        // Get Work.ink ID (checkpoint specific or default)
        providerId = checkpointConfig && checkpointConfig.workinkId && checkpointConfig.workinkId.trim() !== '' 
          ? checkpointConfig.workinkId 
          : settings.workinkId;
          
        // Build Work.ink URL
        redirectUrl = `https://work.ink/${providerId}/checkpoint-${checkpoint}?url=${encodeURIComponent(destinationUrl)}`;
        break;
        
      case 'lootlab':
        // Get Lootlab ID (checkpoint specific or default)
        providerId = checkpointConfig && checkpointConfig.lootlabId && checkpointConfig.lootlabId.trim() !== '' 
          ? checkpointConfig.lootlabId 
          : settings.lootlabId;
          
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