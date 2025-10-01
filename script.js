// Form data storage key
const STORAGE_KEY = 'industrial_sector_form_data';

// Get all form fields
const formFields = [
    'national_number', 'company_name', 'trade_name', 'company_location', 
    'work_field', 'company_status', 'registration_date', 'capital', 
    'sector_description', 'main_section', 'classification', 'fixed_assets_type',
    'book_value_start', 'sports', 'notes', 'new_assets', 'used_assets',
    'additions_improvements', 'damaged_lost', 'available_assets_value',
    'depreciation_year', 'net_book_value_end', 'local_sales', 'exported_sales',
    'total_sales', 'production', 'inventory_start', 'inventory_end'
];

let selectedCompanyData = null;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadFormData();
    loadTableData();
});

// Search button functionality
document.getElementById('searchBtn').addEventListener('click', async () => {
    await performSearch();
});

// Enter key on national number input
document.getElementById('national_number').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        await performSearch();
    }
});

// Perform company search
async function performSearch() {
    const nationalID = document.getElementById('national_number').value.trim();
    const searchBtn = document.getElementById('searchBtn');
    
    if (!nationalID) {
        showToast('الرجاء إدخال الرقم الوطني للمنشأة', 'error');
        return;
    }
    
    // Show loading state
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<span class="loading-spinner"></span>';
    
    try {
        const result = await searchByNationalID(nationalID);
        
        if (result.success) {
            displaySearchResults(result.data);
            document.getElementById('searchResultBox').style.display = 'block';
        } else {
            showToast(result.message || 'لم يتم العثور على نتائج', 'error');
            hideSearchResults();
        }
    } catch (error) {
        console.error('Search error:', error);
        showToast('حدث خطأ أثناء البحث', 'error');
        hideSearchResults();
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'بحث';
    }
}

// Display search results in table
function displaySearchResults(companies) {
    const resultsDiv = document.getElementById('searchResults');
    const tbody = document.getElementById('searchResultsBody');
    
    tbody.innerHTML = '';
    
    companies.forEach(company => {
        const row = tbody.insertRow();
        row.onclick = () => selectCompany(company);
        
        row.innerHTML = `
            <td>${company.national_id}</td>
            <td>${company.company_name}</td>
            <td>${company.type}</td>
            <td>${company.registration_number}</td>
            <td>${company.registration_date}</td>
            <td>${company.capital}</td>
            <td>${company.status}</td>
            <td>${company.province}</td>
            <td>${company.phone}</td>
            <td>${company.sector}</td>
        `;
    });
    
    resultsDiv.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('searchResultBox').style.display = 'none';
    document.getElementById('companyDetailsForm').style.display = 'none';
}

// Select a company from search results
async function selectCompany(company) {
    // Highlight selected row
    const rows = document.getElementById('searchResultsBody').getElementsByTagName('tr');
    for (let row of rows) {
        row.classList.remove('selected');
    }
    event.currentTarget.classList.add('selected');
    
    // Fetch full company details
    const result = await getCompanyDetails(company.national_id);
    
    if (result.success) {
        selectedCompanyData = result.data;
        populateCompanyForm(result.data);
        document.getElementById('companyDetailsForm').style.display = 'grid';
        showToast('تم تحميل بيانات الشركة بنجاح', 'success');
    } else {
        showToast('حدث خطأ أثناء جلب تفاصيل الشركة', 'error');
    }
}

// Populate form with company data
function populateCompanyForm(data) {
    document.getElementById('national_number').value = data.national_id;
    document.getElementById('company_name').value = data.company_name;
    document.getElementById('trade_name').value = data.trade_name || data.company_name;
    document.getElementById('company_location').value = data.location || data.province;
    document.getElementById('work_field').value = data.work_field || '';
    document.getElementById('company_status').value = data.status;
    document.getElementById('registration_date').value = data.registration_date;
    document.getElementById('capital').value = data.capital;
    document.getElementById('sector_description').value = data.sector_description || data.sector;
}

// Save button functionality
document.getElementById('saveBtn').addEventListener('click', () => {
    saveFormData();
    showToast('تم حفظ البيانات بنجاح', 'success');
});

// Clear button functionality
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من رغبتك في تفريغ جميع الحقول ومسح البيانات المحفوظة؟')) {
        clearAllData();
        showToast('تم تفريغ جميع الحقول ومسح البيانات', 'success');
    }
});

// Add to list button
document.querySelector('.btn-add').addEventListener('click', () => {
    addToTable();
});

// Save form data to localStorage
function saveFormData() {
    const formData = {};
    
    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            formData[fieldId] = element.value;
        }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    saveTableData();
}

// Load form data from localStorage
function loadFormData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            formFields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element && formData[fieldId] !== undefined) {
                    element.value = formData[fieldId];
                }
            });
        } catch (e) {
            console.error('Error loading form data:', e);
        }
    }
}

// Clear all data
function clearAllData() {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_table');
    
    // Clear all form fields
    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            if (element.type === 'number') {
                element.value = '0';
            } else {
                element.value = '';
            }
        }
    });
    
    // Clear table
    document.getElementById('assets_table_body').innerHTML = '';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add row to assets table
function addToTable() {
    const fixedAssetsType = document.getElementById('fixed_assets_type').value || 'غير محدد';
    const bookValueStart = document.getElementById('book_value_start').value || '0';
    const newAssets = document.getElementById('new_assets').value || '0';
    const usedAssets = document.getElementById('used_assets').value || '0';
    const additionsImprovements = document.getElementById('additions_improvements').value || '0';
    const damagedLost = document.getElementById('damaged_lost').value || '0';
    const availableAssetsValue = document.getElementById('available_assets_value').value || '0';
    const depreciationYear = document.getElementById('depreciation_year').value || '0';
    const netBookValueEnd = document.getElementById('net_book_value_end').value || '0';
    const notes = document.getElementById('notes').value || '';
    
    const tbody = document.getElementById('assets_table_body');
    const rowCount = tbody.rows.length + 1;
    
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${fixedAssetsType}</td>
        <td>${bookValueStart}</td>
        <td>${parseInt(newAssets) + parseInt(usedAssets)}</td>
        <td>${additionsImprovements}</td>
        <td>${damagedLost}</td>
        <td>${availableAssetsValue}</td>
        <td>${depreciationYear}</td>
        <td>${netBookValueEnd}</td>
        <td>${notes}</td>
    `;
    
    saveTableData();
    showToast('تمت إضافة البيانات إلى الجدول', 'success');
    
    // Clear asset-related fields after adding to table
    document.getElementById('book_value_start').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('new_assets').value = '0';
    document.getElementById('used_assets').value = '0';
    document.getElementById('additions_improvements').value = '0';
    document.getElementById('damaged_lost').value = '0';
    document.getElementById('available_assets_value').value = '0';
    document.getElementById('depreciation_year').value = '0';
    document.getElementById('net_book_value_end').value = '0';
}

// Save table data to localStorage
function saveTableData() {
    const tbody = document.getElementById('assets_table_body');
    const rows = [];
    
    for (let i = 0; i < tbody.rows.length; i++) {
        const cells = tbody.rows[i].cells;
        const rowData = [];
        for (let j = 0; j < cells.length; j++) {
            rowData.push(cells[j].textContent);
        }
        rows.push(rowData);
    }
    
    localStorage.setItem(STORAGE_KEY + '_table', JSON.stringify(rows));
}

// Load table data from localStorage
function loadTableData() {
    const savedTableData = localStorage.getItem(STORAGE_KEY + '_table');
    
    if (savedTableData) {
        try {
            const rows = JSON.parse(savedTableData);
            const tbody = document.getElementById('assets_table_body');
            tbody.innerHTML = '';
            
            rows.forEach(rowData => {
                const row = tbody.insertRow();
                rowData.forEach(cellData => {
                    const cell = row.insertCell();
                    cell.textContent = cellData;
                });
            });
        } catch (e) {
            console.error('Error loading table data:', e);
        }
    }
}

// Auto-save on input change
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('change', () => {
        saveFormData();
    });
});

// Calculate totals automatically
document.getElementById('new_assets').addEventListener('input', calculatePurchasedTotal);
document.getElementById('used_assets').addEventListener('input', calculatePurchasedTotal);

function calculatePurchasedTotal() {
    const newAssets = parseInt(document.getElementById('new_assets').value) || 0;
    const usedAssets = parseInt(document.getElementById('used_assets').value) || 0;
    // You can display the total somewhere if needed
}

