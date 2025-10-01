// Mock API data for demonstration
// Replace this with actual API calls when you have access to the real API

const MOCK_COMPANIES = [
    {
        national_id: "200205004",
        company_name: "يوسف فندي وسالم فندي",
        type: "تضامن",
        registration_number: "125525",
        registration_date: "17/04/2025",
        capital: "5000",
        status: "قائمة",
        province: "عمان",
        phone: "775392581",
        sector: "صناعي"
    },
    {
        national_id: "200105003",
        company_name: "شركة الصناعات الأردنية",
        type: "مساهمة خاصة",
        registration_number: "125526",
        registration_date: "15/03/2020",
        capital: "100000",
        status: "قائمة",
        province: "عمان",
        phone: "775392582",
        sector: "صناعي"
    },
    {
        national_id: "200305005",
        company_name: "مصنع الأمل للمنتجات الغذائية",
        type: "ذات مسؤولية محدودة",
        registration_number: "125527",
        registration_date: "20/06/2021",
        capital: "50000",
        status: "قائمة",
        province: "اربد",
        phone: "775392583",
        sector: "صناعي"
    },
    {
        national_id: "200405006",
        company_name: "شركة النسيج الوطنية",
        type: "مساهمة عامة",
        registration_number: "125528",
        registration_date: "10/01/2019",
        capital: "500000",
        status: "قائمة",
        province: "الزرقاء",
        phone: "775392584",
        sector: "صناعي"
    },
    {
        national_id: "200505007",
        company_name: "مصانع الأدوية الأردنية",
        type: "مساهمة خاصة",
        registration_number: "125529",
        registration_date: "05/09/2018",
        capital: "250000",
        status: "قائمة",
        province: "عمان",
        phone: "775392585",
        sector: "صناعي"
    }
];

// Simulate API delay
function simulateAPIDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

// Mock API function to search by national ID
async function searchByNationalID(nationalID) {
    await simulateAPIDelay();
    
    if (!nationalID || nationalID.trim() === '') {
        return {
            success: false,
            message: 'الرجاء إدخال الرقم الوطني للمنشأة'
        };
    }
    
    // Search for exact match or partial match
    const results = MOCK_COMPANIES.filter(company => 
        company.national_id.includes(nationalID)
    );
    
    if (results.length === 0) {
        return {
            success: false,
            message: 'لم يتم العثور على نتائج'
        };
    }
    
    return {
        success: true,
        data: results
    };
}

// Mock API function to get company details
async function getCompanyDetails(nationalID) {
    await simulateAPIDelay();
    
    const company = MOCK_COMPANIES.find(c => c.national_id === nationalID);
    
    if (!company) {
        return {
            success: false,
            message: 'لم يتم العثور على الشركة'
        };
    }
    
    // Extended company details
    return {
        success: true,
        data: {
            ...company,
            trade_name: company.company_name + " (التجاري)",
            location: company.province,
            work_field: "تصنيع وإنتاج",
            sector_description: company.type + " - " + company.sector
        }
    };
}

// ============================================
// REAL API INTEGRATION TEMPLATE
// ============================================
// When you have access to the real API, replace the functions above with:

/*
const API_BASE_URL = 'https://api.example.gov.jo'; // Replace with actual API URL
const API_KEY = 'your-api-key-here'; // If required

async function searchByNationalID(nationalID) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` // If required
            },
            body: JSON.stringify({
                national_id: nationalID
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return {
            success: true,
            data: data.results || data
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: 'حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى'
        };
    }
}

async function getCompanyDetails(nationalID) {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${nationalID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` // If required
            }
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: 'حدث خطأ أثناء جلب البيانات'
        };
    }
}
*/

