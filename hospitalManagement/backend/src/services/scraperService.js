// In a real app, this would use Puppeteer or Cheerio to scrape websites.
// For this MVP, we return mock data.

const getMedicinePrices = async (medicineName) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { vendor: 'Local Pharmacy', price: 50, link: '#' },
    { vendor: '1mg (Online)', price: 42, link: 'https://www.1mg.com' },
    { vendor: 'Pharmeasy', price: 45, link: 'https://pharmeasy.in' },
    { vendor: 'Apollo Pharmacy', price: 48, link: 'https://www.apollopharmacy.in' }
  ];
};

module.exports = { getMedicinePrices };