// Form data storage key
const STORAGE_KEY = 'industrial_sector_form_data';

// Store current JSON data globally
let currentJsonData = null;
let availableYears = [];

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
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
});

// Save button functionality
document.getElementById('saveBtn').addEventListener('click', () => {
    showToast('تم حفظ البيانات بنجاح', 'success');
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

        if (availableYears.length === 0) {
            showToast('لم يتم العثور على أعمدة السنوات في البيانات', 'error');
            return;
        }

        // Populate year selector dropdown
        populateYearSelector(availableYears);

        // Use the most recent year as default
        const selectedYear = availableYears[availableYears.length - 1];
        document.getElementById('year_selector').value = selectedYear;

        console.log('Total JSON entries:', dataArray.length);
        console.log('Selected year:', selectedYear);

        // Create dynamic form fields ONLY from JSON data that has values
        createDynamicFormsFromJSON(dataArray, selectedYear);

        // Save the JSON data itself to localStorage for reload
        localStorage.setItem(STORAGE_KEY + '_json', JSON.stringify(dataArray));
        localStorage.setItem(STORAGE_KEY + '_year', selectedYear);
        
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

// Populate year selector dropdown
function populateYearSelector(years) {
    const yearSelector = document.getElementById('year_selector');
    if (!yearSelector) return;
    
    // Clear existing options except the first one
    yearSelector.innerHTML = '<option value="">-- اختر السنة --</option>';
    
    // Add year options
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `سنة ${year}`;
        yearSelector.appendChild(option);
    });
    
    // Enable the selector
    yearSelector.disabled = false;
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
                
                createDynamicFormsFromJSON(dataArray, year);
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
        if (!label) return false;
        
        // Check if any year has a non-null value
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
        const label = (item.Label || item.label || '').toString().trim();
        const note = (item['إيضاح'] || item['ايضاح'] || '').toString().trim();
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label + (note ? ` (إيضاح ${note})` : '');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `dynamic_field_${index}`;
        input.readOnly = true;
        
        // Use the selected year value, or first available
        let value = item[selectedYear];
        if (value === null || value === undefined) {
            for (const year of yearColumns) {
                if (item[year] !== null && item[year] !== undefined) {
                    value = item[year];
                    break;
                }
            }
        }
        
        input.value = typeof value === 'number' ? value.toLocaleString() : value;
        
        formGroup.appendChild(labelEl);
        formGroup.appendChild(input);
        container.appendChild(formGroup);
    });
    
    console.log(`Created ${itemsWithValues.length} dynamic form fields`);
}
