// Form data storage key
const STORAGE_KEY = 'industrial_sector_form_data';

// Store current JSON data globally
let currentJsonData = null;
let availableYears = [];

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    loadSavedJSON(); // Load previously imported JSON if exists
    
    // Wire JSON import button
    const importBtn = document.getElementById('importJsonBtn');
    if (importBtn) {
        importBtn.addEventListener('click', handleImportJsonClick);
    }
    
    // Wire year selector change event
    const yearSelector = document.getElementById('year_selector');
    if (yearSelector) {
        yearSelector.addEventListener('change', handleYearChange);
    }
    
    console.log('About to set up CSV export button...');
    // Wire CSV export button
    console.log('Looking for CSV export button...');
    const exportBtn = document.getElementById('exportCsvBtn');
    console.log('Button element:', exportBtn);
    if (exportBtn) {
        console.log('CSV Export button found and event listener added');
        exportBtn.addEventListener('click', () => {
            console.log('CSV Export button clicked!');
            alert('CSV Export clicked - starting export...');
            exportToCSV();
        });
    } else {
        console.error('CSV Export button not found!');
        // Let's try to find all buttons
        const allButtons = document.querySelectorAll('button');
        console.log('All buttons found:', allButtons);
        allButtons.forEach((btn, index) => {
            console.log(`Button ${index}: id="${btn.id}", text="${btn.textContent}"`);
        });
    }
});

// Save button functionality
document.getElementById('saveBtn').addEventListener('click', () => {
    showToast('تم حفظ البيانات بنجاح', 'success');
});

// CSV Export button functionality
document.getElementById('exportCsvBtn').addEventListener('click', () => {
    console.log('CSV Export button clicked!');
    alert('CSV Export clicked - starting export...');
    exportToCSV();
});

// Clear button functionality
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من رغبتك في تفريغ جميع الحقول ومسح البيانات المحفوظة؟')) {
        clearAllData();
        showToast('تم تفريغ جميع الحقول ومسح البيانات', 'success');
    }
});


// Clear all data
function clearAllData() {
    localStorage.removeItem(STORAGE_KEY + '_json');
    localStorage.removeItem(STORAGE_KEY + '_year');
    
    const dynamicContainer = document.getElementById('dynamic_fields');
    const dynamicSection = document.getElementById('dynamic_forms_container');
    if (dynamicContainer) dynamicContainer.innerHTML = '';
    if (dynamicSection) dynamicSection.style.display = 'none';
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

// ===== JSON Import Logic =====
async function handleImportJsonClick() {
    const fileInput = document.getElementById('jsonUpload');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('الرجاء اختيار ملف JSON أولاً', 'error');
        return;
    }

    try {
        const file = fileInput.files[0];
        const text = await file.text();
        const dataArray = JSON.parse(text);
        if (!Array.isArray(dataArray)) {
            showToast('صيغة الملف غير صحيحة. يجب أن يكون مصفوفة JSON', 'error');
            return;
        }

        // Store JSON data globally
        currentJsonData = dataArray;

        // Detect all available years from JSON
        availableYears = detectAllYears(dataArray);
        console.log('Available years:', availableYears);

        // Populate year selector dropdown (handles empty case internally)
        populateYearSelector(availableYears);

        let selectedYear = '';
        if (availableYears.length > 0) {
            // Use the most recent year as default
            selectedYear = availableYears[availableYears.length - 1];
            document.getElementById('year_selector').value = selectedYear;
            console.log('Selected year:', selectedYear);
        } else {
            // No year columns present
            const yearSelector = document.getElementById('year_selector');
            if (yearSelector) yearSelector.disabled = true;
            console.log('No year columns found in JSON. Proceeding without year filter.');
        }

        console.log('Total JSON entries:', dataArray.length);

        // Populate fixed fields (company/sector) when JSON is structured by Arabic keys
        populateStaticFieldsFromStructuredJson(dataArray);

        // Create dynamic form fields from JSON (works with or without years)
        createDynamicFormsFromJSON(dataArray, selectedYear);

        // Save the JSON data itself to localStorage for reload
        localStorage.setItem(STORAGE_KEY + '_json', JSON.stringify(dataArray));
        if (selectedYear) localStorage.setItem(STORAGE_KEY + '_year', selectedYear);
        
        showToast('تم استيراد JSON وتعبئة الحقول بنجاح', 'success');
    } catch (e) {
        console.error('JSON import error:', e);
        showToast('حدث خطأ أثناء استيراد الملف', 'error');
    }
}

// Handle year change
function handleYearChange(event) {
    const selectedYear = event.target.value;
    if (!selectedYear || !currentJsonData) return;

    console.log('Year changed to:', selectedYear);
    
    // Re-create dynamic forms with new year
    createDynamicFormsFromJSON(currentJsonData, selectedYear);
    
    // Save selected year to localStorage
    localStorage.setItem(STORAGE_KEY + '_year', selectedYear);
    
    showToast(`تم التبديل إلى سنة ${selectedYear}`, 'success');
}

// Detect all years in the JSON data
function detectAllYears(dataArray) {
    const years = new Set();
    if (dataArray.length > 0) {
        Object.keys(dataArray[0]).forEach(key => {
            if (/^\d{4}$/.test(key)) { // Match 4-digit years
                years.add(key);
            }
        });
    }
    return Array.from(years).sort(); // Return sorted array
}

// Populate known fixed fields when JSON is structured with Arabic keys
function populateStaticFieldsFromStructuredJson(dataArray) {
    try {
        if (!Array.isArray(dataArray)) return;
        const byField = new Map();
        dataArray.forEach(item => {
            const type = item['نوع البيانات'];
            const field = item['الحقل'];
            const value = item['القيمة'];
            if (type && field) byField.set(field.trim(), value);
        });

        const map = [
            ['الرقم الوطني للمنشأة','national_number'],
            ['اسم الشركة','company_name'],
            ['الاسم التجاري للشركة','trade_name'],
            ['موقع الشركة','company_location'],
            ['مجال العمل','work_field'],
            ['حالة الشركة','company_status'],
            ['تاريخ التسجيل','registration_date'],
            ['رأس المال','capital'],
            ['توضيح القطاع','sector_description'],
            ['القسم الرئيسي','main_section'],
            ['التصنيف','classification'],
            ['سنة الميزانية','year_selector']
        ];
        map.forEach(([label, id]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'main_section' || id === 'classification' || id === 'year_selector') {
                const val = byField.get(label);
                if (el.tagName === 'SELECT') {
                    // Try to set value directly if present as option text or value
                    const option = Array.from(el.options).find(o => o.value === val || o.textContent === val || o.textContent.includes(val || ''));
                    if (option) el.value = option.value; else el.value = '';
                } else {
                    el.value = val || '';
                }
            } else {
                el.value = byField.get(label) || '';
            }
        });
    } catch (e) {
        console.warn('populateStaticFieldsFromStructuredJson failed:', e);
    }
}

// Populate year selector dropdown
function populateYearSelector(years) {
    const yearSelector = document.getElementById('year_selector');
    if (!yearSelector) return;
    
    // Clear existing options except the first one
    yearSelector.innerHTML = '<option value="">-- اختر السنة --</option>';
    
    if (years && years.length > 0) {
        // Add year options
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `سنة ${year}`;
            yearSelector.appendChild(option);
        });
        // Enable the selector
        yearSelector.disabled = false;
    } else {
        // No years available
        yearSelector.disabled = true;
    }
}


function loadSavedJSON() {
    try {
        const savedJSON = localStorage.getItem(STORAGE_KEY + '_json');
        const savedYear = localStorage.getItem(STORAGE_KEY + '_year');
        
        if (savedJSON) {
            const dataArray = JSON.parse(savedJSON);
            
            // Store JSON data globally
            currentJsonData = dataArray;
            
            // Detect all available years
            availableYears = detectAllYears(dataArray);
            
            if (availableYears.length > 0) {
                // Populate year selector
                populateYearSelector(availableYears);
                
                // Use saved year or most recent
                const year = savedYear && availableYears.includes(savedYear) 
                    ? savedYear 
                    : availableYears[availableYears.length - 1];
                
                document.getElementById('year_selector').value = year;
                
                console.log('Loading saved JSON data from localStorage...');
                console.log('Available years:', availableYears);
                console.log('Selected year:', year);
                
                // Populate fixed fields (company/sector) if present
                populateStaticFieldsFromStructuredJson(dataArray);

                createDynamicFormsFromJSON(dataArray, year);
            } else {
                // No years case: still populate fields and dynamic values
                const yearSelector = document.getElementById('year_selector');
                if (yearSelector) yearSelector.disabled = true;
                populateStaticFieldsFromStructuredJson(dataArray);
                createDynamicFormsFromJSON(dataArray, '');
            }
        }
    } catch (e) {
        console.warn('Could not load saved JSON:', e);
    }
}

function createDynamicFormsFromJSON(dataArray, selectedYear) {
    const container = document.getElementById('dynamic_fields');
    const section = document.getElementById('dynamic_forms_container');
    
    if (!container || !section) return;
    
    // Clear existing
    container.innerHTML = '';
    
    console.log('Creating dynamic forms from JSON...');
    
    // Detect all year columns
    const yearColumns = [];
    if (dataArray.length > 0) {
        Object.keys(dataArray[0]).forEach(key => {
            if (/^\d{4}$/.test(key)) yearColumns.push(key);
        });
    }
    yearColumns.sort();
    
    // Filter items that have actual values (not null, not empty labels)
    const itemsWithValues = dataArray.filter(item => {
        const label = (item.Label || item.label || '').toString().trim();
        // Support Arabic key 'الحقل'
        const arabicField = (item['الحقل'] || '').toString().trim();
        const effectiveLabel = label || arabicField;
        if (!effectiveLabel) return false;
        
        if (yearColumns.length === 0) {
            // No years: accept items with a generic value field or non-empty value
            const genericVal = item.Value ?? item.value ?? item.amount ?? item.total ?? item['قيمة'] ?? item['القيمة'];
            return genericVal !== null && genericVal !== undefined && genericVal !== '';
        }
        // With years: check any year has a non-null value
        return yearColumns.some(year => {
            const val = item[year];
            return val !== null && val !== undefined && val !== '';
        });
    });
    
    console.log(`Found ${itemsWithValues.length} items with values out of ${dataArray.length} total`);
    
    if (itemsWithValues.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    // Show the section
    section.style.display = 'block';
    
    // Create form fields for each item with values
    itemsWithValues.forEach((item, index) => {
        const label = (item.Label || item.label || item['الحقل'] || '').toString().trim();
        const note = (item['إيضاح'] || item['ايضاح'] || '').toString().trim();
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label + (note ? ` (إيضاح ${note})` : '');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `dynamic_field_${index}`;
        input.readOnly = true;
        
        let value;
        if (yearColumns.length === 0) {
            // No years: pick a generic value field
            value = item.Value ?? item.value ?? item.amount ?? item.total ?? item['قيمة'] ?? item['القيمة'] ?? '';
        } else {
            // With years: use selected year, or first available
            value = item[selectedYear];
            if (value === null || value === undefined) {
                for (const year of yearColumns) {
                    if (item[year] !== null && item[year] !== undefined) {
                        value = item[year];
                        break;
                    }
                }
            }
        }
        
        input.value = typeof value === 'number' ? value.toLocaleString() : (value ?? '');
        
        formGroup.appendChild(labelEl);
        formGroup.appendChild(input);
        container.appendChild(formGroup);
    });
    
    console.log(`Created ${itemsWithValues.length} dynamic form fields`);
}

// ===== CSV Export Functions =====

// Function to collect all form data - make it globally accessible
window.collectAllFormData = function() {
    const formData = {
        companyInfo: {},
        sectorInfo: {},
        financialData: []
    };

    // Collect company information
    const companyFields = [
        'national_number', 'company_name', 'trade_name', 'company_location',
        'work_field', 'company_status', 'registration_date', 'capital', 'sector_description'
    ];
    
    companyFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            formData.companyInfo[fieldId] = element.value || '';
        }
    });

    // Collect sector information
    const sectorFields = ['main_section', 'classification', 'year_selector'];
    sectorFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            formData.sectorInfo[fieldId] = element.value || '';
        }
    });

    // Collect dynamic financial data
    const dynamicFields = document.querySelectorAll('#dynamic_fields .form-group');
    dynamicFields.forEach((fieldGroup, index) => {
        const label = fieldGroup.querySelector('label');
        const input = fieldGroup.querySelector('input');
        
        if (label && input) {
            formData.financialData.push({
                label: label.textContent.trim(),
                value: input.value || '',
                fieldId: input.id
            });
        }
    });

    return formData;
}

// Function to escape CSV values - make it globally accessible
window.escapeCSVValue = function(value) {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If the value contains comma, newline, or double quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
    }
    
    return stringValue;
}

// Function to generate CSV content - make it globally accessible
window.generateCSVContent = function(formData) {
    const csvRows = [];
    
    // Add header row
    csvRows.push('نوع البيانات,الحقل,القيمة');
    
    // Add company information
    csvRows.push('معلومات الشركة,الرقم الوطني للمنشأة,' + escapeCSVValue(formData.companyInfo.national_number));
    csvRows.push('معلومات الشركة,اسم الشركة,' + escapeCSVValue(formData.companyInfo.company_name));
    csvRows.push('معلومات الشركة,الاسم التجاري للشركة,' + escapeCSVValue(formData.companyInfo.trade_name));
    csvRows.push('معلومات الشركة,موقع الشركة,' + escapeCSVValue(formData.companyInfo.company_location));
    csvRows.push('معلومات الشركة,مجال العمل,' + escapeCSVValue(formData.companyInfo.work_field));
    csvRows.push('معلومات الشركة,حالة الشركة,' + escapeCSVValue(formData.companyInfo.company_status));
    csvRows.push('معلومات الشركة,تاريخ التسجيل,' + escapeCSVValue(formData.companyInfo.registration_date));
    csvRows.push('معلومات الشركة,رأس المال,' + escapeCSVValue(formData.companyInfo.capital));
    csvRows.push('معلومات الشركة,توضيح القطاع,' + escapeCSVValue(formData.companyInfo.sector_description));
    
    // Add sector information
    csvRows.push('القطاع والسنة المالية,القسم الرئيسي,' + escapeCSVValue(formData.sectorInfo.main_section));
    csvRows.push('القطاع والسنة المالية,التصنيف,' + escapeCSVValue(formData.sectorInfo.classification));
    csvRows.push('القطاع والسنة المالية,سنة الميزانية,' + escapeCSVValue(formData.sectorInfo.year_selector));
    
    // Add financial data
    formData.financialData.forEach(item => {
        csvRows.push('البيانات المالية,' + escapeCSVValue(item.label) + ',' + escapeCSVValue(item.value));
    });
    
    return csvRows.join('\n');
}

// Function to download CSV file - make it globally accessible
window.downloadCSV = function(csvContent, filename) {
    // Create BOM for UTF-8 to ensure proper Arabic text display in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
}

// Main CSV export function - make it globally accessible
window.exportToCSV = function() {
    console.log('exportToCSV function called');
    try {
        // Check if there's any data to export
        const formData = collectAllFormData();
        console.log('Form data collected:', formData);
        
        // Check if we have any meaningful data
        const hasCompanyData = Object.values(formData.companyInfo).some(value => value.trim() !== '');
        const hasSectorData = Object.values(formData.sectorInfo).some(value => value.trim() !== '');
        const hasFinancialData = formData.financialData.length > 0;
        
        if (!hasCompanyData && !hasSectorData && !hasFinancialData) {
            showToast('لا توجد بيانات للتصدير. يرجى ملء بعض الحقول أولاً', 'error');
            return;
        }
        
        // Generate CSV content
        const csvContent = generateCSVContent(formData);
        
        // Create filename with current date
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0');
        const filename = `ميزانيات_شركات_القطاع_الصناعي_${dateStr}.csv`;
        
        // Download the file
        downloadCSV(csvContent, filename);
        
        showToast('تم تصدير البيانات إلى ملف CSV بنجاح', 'success');
        
    } catch (error) {
        console.error('CSV export error:', error);
        showToast('حدث خطأ أثناء تصدير البيانات', 'error');
    }
}

