
// Mock Timocom Service
// In production, this would call the actual Timocom API

export const timocomService = {
  getFreights: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        id: 'TC-1001',
        description: 'DE-80 München -> HU-10 Budapest, 24t, ponyvás, azonnali indulás, fix 950€',
        pickupDate: '2023-11-20',
        vehicleType: 'Tautliner',
        distance: 680,
        price: 950,
        currency: 'EUR',
      },
      {
        id: 'TC-1002',
        description: 'PL-00 Varsó -> SK-80 Pozsony, 12t, hűtős, +2/+8C, 33 pal, cseredarabos',
        pickupDate: '2023-11-21',
        vehicleType: 'Frigo',
        distance: 540,
        price: 600,
        currency: 'EUR',
      },
      {
        id: 'TC-1003',
        description: 'HU-40 Debrecen -> RO-40 Kolozsvár, 1.5t furgon, 4 pal, expressz',
        pickupDate: '2023-11-20',
        vehicleType: 'Van',
        distance: 220,
        price: 250,
        currency: 'EUR',
      },
      {
        id: 'TC-1004',
        description: 'AT-10 Bécs -> HU-90 Győr, 24t, mega, építőanyag, daruzható',
        pickupDate: '2023-11-22',
        vehicleType: 'Mega',
        distance: 120,
        price: 350,
        currency: 'EUR',
      },
      {
        id: 'TC-1005',
        description: 'IT-20 Milánó -> HU-10 Budapest, 24t, dobozos, nagy értékű áru, Tapa',
        pickupDate: '2023-11-23',
        vehicleType: 'Box',
        distance: 980,
        price: 1200,
        currency: 'EUR',
      },
    ];
  },

  sendOffer: async (freightId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Offer sent for ${freightId}: ${amount}`);
    return { success: true, message: 'Offer sent successfully' };
  }
};
