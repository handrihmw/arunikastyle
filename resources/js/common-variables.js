module.exports = {
    period: {
        '1M': {
            text:'1 Bulan',
            num_of_month: 1,
            unit: 'Bulan',
        },
        '3M': {
            text:'3 Bulan',
            num_of_month: 3,
            unit: 'Bulan'
        },
        '6M': {
            text:'6 Bulan',
            num_of_month: 6,
            unit: 'Bulan',
        },
        '1Y': {
            text:'1 Tahun',
            num_of_month: 12,
            unit: 'Tahun',
        },
        '2Y': {
            text:'2 Tahun',
            num_of_month: 24,
            unit: 'Tahun',
        },
        '3Y': {
            text:'3 Tahun',
            num_of_month: 36,
            unit: 'Tahun'
        },
    },
    bb_url: process.env.BB_URL,
    domain: process.env.DOMAIN,
    niaga_url: process.env.NIAGA_URL,
    allow_mkt_script: process.env.ALLOW_MKT_SCRIPT
};
