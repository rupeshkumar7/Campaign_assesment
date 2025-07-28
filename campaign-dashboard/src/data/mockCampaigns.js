//Mock data for Campaign Dashboard

const statuses = ['Draft', 'Scheduled', 'Active', 'Completed', 'Cancelled'];
const channels = ['Email', 'Social Media', 'Display', 'SMS', 'Search'];

const mockCampaigns = Array.from({ length: 100 }, (_, i) => {
  const impressions = Math.floor(Math.random() * 10000) + 500;
  const clicks = Math.floor(Math.random() * impressions);
  return {
    CampaignId: `CID-${1000 + i}`,
    CampaignName: `Campaign ${i + 1}`,
    ClientName: `Client ${i + 1}`,
    StartDate: `2024-0${(i % 6) + 1}-01`,
    EndDate: `2024-0${(i % 6) + 1}-28`,
    Status: statuses[i % statuses.length],
    Budget: Math.floor(Math.random() * 50000 + 10000),
    Spent: Math.floor(Math.random() * 30000),
    Impressions: impressions,
    Clicks: clicks,
    ConversionRate: ((clicks / impressions) * 100).toFixed(2),
    Channel: channels[i % channels.length],
    Manager: `Manager ${i + 1}`,
    Thumbnail: `https://via.placeholder.com/100x60?text=C${i + 1}`,
    LastModified: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export default mockCampaigns;
