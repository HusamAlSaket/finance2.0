// Form data storage key
const STORAGE_KEY = 'industrial_sector_form_data';

// Legacy: specific list kept for reference, but dynamic scanning is used now
const formFields = [];

function getFieldElements() {
    return Array.from(document.querySelectorAll('input, select, textarea'))
        .filter(el => el.id && !['button','submit','file'].includes(el.type));
}

let selectedCompanyData = null;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadFormData();
    loadTableData();
    // Wire JSON import button
    const importBtn = document.getElementById('importJsonBtn');
    if (importBtn) {
        importBtn.addEventListener('click', handleImportJsonClick);
    }
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
    getFieldElements().forEach(element => {
        formData[element.id] = element.value;
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
            getFieldElements().forEach(element => {
                if (formData[element.id] !== undefined) {
                    element.value = formData[element.id];
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
    getFieldElements().forEach(element => {
        if (element.type === 'number') {
            element.value = '0';
        } else {
            element.value = '';
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

        const selectedYear = detectYearFromUIOrData(dataArray) || '2024';
        const labelToValue = buildLabelToValueMap(dataArray, selectedYear);

        console.log('Detected year:', selectedYear);
        console.log('Total JSON entries:', dataArray.length);
        console.log('Label-to-value map entries:', Object.keys(labelToValue).length);
        console.log('Sample labels:', Object.keys(labelToValue).slice(0, 10));

        // Reset form values so missing fields remain null/blank
        resetFormValuesForImport();

        applyJsonToForm(labelToValue);
        applyJsonByScanningLabels(labelToValue);
        // Populate financial statement table with all JSON data in order
        populateFinancialStatementTable(dataArray, selectedYear);
        logUnmappedLabels(dataArray, labelToValue);

        saveFormData();
        saveTableData();
        showToast('تم استيراد JSON وتعبئة الحقول بنجاح', 'success');
    } catch (e) {
        console.error('JSON import error:', e);
        showToast('فشل استيراد JSON. تحقق من الملف.', 'error');
    }
}

function detectYearFromUIOrData(dataArray) {
    // Try from UI year label if present
    const yearSpan = document.querySelector('.year-value');
    if (yearSpan) {
        const match = yearSpan.textContent.match(/\d{4}/);
        if (match) return match[0];
    }
    // Fallback: infer from first object keys that look like years
    for (const item of dataArray) {
        for (const key of Object.keys(item)) {
            if (/^\d{4}$/.test(key)) return key;
        }
    }
    return null;
}

function buildLabelToValueMap(dataArray, yearKey) {
    const map = {};
    dataArray.forEach(item => {
        const label = (item.Label || item.label || '').toString().trim();
        if (!label) return;
        const value = item[yearKey] ?? item.value ?? null;
        const normalized = normalizeArabic(label);
        map[normalized] = value;
    });
    console.log('Built label map with', Object.keys(map).length, 'entries');
    return map;
}

function normalizeArabic(text) {
    return text
        .replace(/[\u064B-\u0652]/g, '') // remove tashkeel
        .replace(/[إأآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function applyJsonByScanningLabels(labelToValue) {
    // Strategy: for each input/select/textarea, find the nearest label-like element text and match
    const fields = Array.from(document.querySelectorAll('input, select, textarea'));
    let filledCount = 0;
    fields.forEach(el => {
        if (['button','submit','file'].includes(el.type)) return;
        const labelText = findNearestArabicLabelText(el);
        if (!labelText) return;
        const key = normalizeArabic(labelText);
        if (key in labelToValue) {
            const val = labelToValue[key] == null ? '' : labelToValue[key];
            el.value = val;
            filledCount++;
            console.log('Filled:', el.id, '<=', labelText, '=', val);
        } else {
            // fuzzy contains
            const foundKey = Object.keys(labelToValue).find(k => k && (k.includes(key) || key.includes(k)));
            if (foundKey) {
                const val = labelToValue[foundKey] == null ? '' : labelToValue[foundKey];
                el.value = val;
                filledCount++;
                console.log('Filled (fuzzy):', el.id, '<=', labelText, '~', foundKey, '=', val);
            }
        }
    });
    console.log('Total fields filled by label scanning:', filledCount);
}

function findNearestArabicLabelText(el) {
    // 1) Explicit <label for>
    if (el.id) {
        const lab = document.querySelector(`label[for="${el.id}"]`);
        if (lab && lab.textContent) return lab.textContent;
    }
    // 2) Previous sibling label in same form-group
    const formGroup = el.closest('.form-group');
    if (formGroup) {
        const lbl = formGroup.querySelector('label');
        if (lbl && lbl.textContent) return lbl.textContent;
    }
    // 3) Table-based: header cell in same row or previous cell
    const td = el.closest('td');
    const tr = el.closest('tr');
    if (tr) {
        // prefer the adjacent header/title cell
        const cells = Array.from(tr.children);
        const idx = cells.indexOf(td);
        if (idx >= 0) {
            // look left then right for a label-like cell
            for (let i = idx - 1; i >= 0; i--) {
                const txt = cells[i].textContent && cells[i].textContent.trim();
                if (txt) return txt;
            }
            for (let i = idx + 1; i < cells.length; i++) {
                const txt = cells[i].textContent && cells[i].textContent.trim();
                if (txt) return txt;
            }
        }
    }
    // 4) Section title fallback
    const section = el.closest('.form-section');
    if (section) {
        const title = section.querySelector('.section-title');
        if (title && title.textContent) return title.textContent;
    }
    return null;
}

function applyJsonToForm(labelToValue) {
    // Heuristic mappings from labels to our form fields
    const mappings = [
        { labels: ['اسم الشركه', 'الشركه', 'شركة'], field: 'company_name' },
        { labels: ['الاسم التجاري', 'الاسم التجاري للشركه'], field: 'trade_name' },
        { labels: ['موقع الشركه', 'الموقع'], field: 'company_location' },
        { labels: ['مجال العمل'], field: 'work_field' },
        { labels: ['حاله الشركه', 'الحاله'], field: 'company_status' },
        { labels: ['تاريخ التسجيل'], field: 'registration_date' },
        { labels: ['راس المال', 'رأس المال', 'رأس المال المصرح والمكتتب به والمدفوع'], field: 'capital' },
        { labels: ['توضيح القطاع', 'القطاع'], field: 'sector_description' },
        { labels: ['المبيعات المحليه'], field: 'local_sales' },
        { labels: ['المبيعات المصدره'], field: 'exported_sales' },
        { labels: ['مجموع المبيعات', 'اجمالي المبيعات'], field: 'total_sales' },
        { labels: ['الانتاج'], field: 'production' },
        { labels: ['مخزون بضاعه جاهزه بدايه المده'], field: 'inventory_start' },
        { labels: ['مخزون بضاعه جاهزه اخر المده', 'مخزون بضاعه جاهزه نهايه المده'], field: 'inventory_end' }
    ];

    mappings.forEach(mapItem => {
        const matched = findFirstMatch(labelToValue, mapItem.labels);
        if (matched != null) {
            const el = document.getElementById(mapItem.field);
            if (el) el.value = matched;
        }
    });
}

function findFirstMatch(map, variants) {
    for (const raw of variants) {
        const key = normalizeArabic(raw);
        if (key in map) return map[key];
    }
    // fuzzy contains
    const keys = Object.keys(map);
    for (const k of keys) {
        for (const raw of variants) {
            const n = normalizeArabic(raw);
            if (k.includes(n)) return map[k];
        }
    }
    return null;
}

function applyJsonToAssetsTable(dataArray, yearKey) {
    // Clear existing rows
    const tbody = document.getElementById('assets_table_body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Optional strict form order (can be extended for demo without touching JSON)
    const STRICT_FORM_ORDER = [];

    // Keep original JSON order; include even nulls so missing remain blank
    const entries = dataArray
        .filter(it => it && (it.Label || it.label))
        .map((it, idx) => ({
            idx,
            label: it.Label || it.label,
            normLabel: normalizeArabic(it.Label || it.label),
            value: it[yearKey] ?? null,
            note: it['إيضاح'] || it['ايضاح'] || ''
        }));

    // If strict form order provided, reorder using that; otherwise keep JSON order
    const hasStrict = STRICT_FORM_ORDER.length > 0;
    const orderIndexMap = new Map(STRICT_FORM_ORDER.map((l, i) => [normalizeArabic(l), i]));
    entries.sort((a, b) => {
        if (!hasStrict) return a.idx - b.idx;
        const ai = orderIndexMap.has(a.normLabel) ? orderIndexMap.get(a.normLabel) : Number.MAX_SAFE_INTEGER - a.idx;
        const bi = orderIndexMap.has(b.normLabel) ? orderIndexMap.get(b.normLabel) : Number.MAX_SAFE_INTEGER - b.idx;
        if (ai !== bi) return ai - bi;
        return a.idx - b.idx;
    });

    // Populate rows mapping into our 10-column table format
    let rowNum = 1;
    for (const e of entries) {
        const row = tbody.insertRow();
        row.insertCell().textContent = String(rowNum++);
        row.insertCell().textContent = e.label;
        row.insertCell().textContent = ''; // book_value_start unknown
        row.insertCell().textContent = e.value == null ? '' : String(e.value); // JSON value
        row.insertCell().textContent = '';
        row.insertCell().textContent = '';
        row.insertCell().textContent = '';
        row.insertCell().textContent = '';
        row.insertCell().textContent = '';
        row.insertCell().textContent = e.note || '';
    }
}

function orderIndex(label, hints) {
    for (let i = 0; i < hints.length; i++) {
        if (label.includes(hints[i])) return i;
    }
    return Number.MAX_SAFE_INTEGER;
}

function resetFormValuesForImport() {
    try {
        getFieldElements().forEach(el => {
            if (el.tagName === 'SELECT') {
                el.value = '';
            } else {
                el.value = '';
            }
        });
        // Also clear the table so we rebuild from JSON
        const tbody = document.getElementById('assets_table_body');
        if (tbody) tbody.innerHTML = '';
    } catch (_) {
        // no-op
    }
}

function populateFinancialStatementTable(dataArray, selectedYear) {
    const tbody = document.getElementById('financial_statement_table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    console.log('Populating financial statement table with', dataArray.length, 'rows');
    
    // Detect all year columns in the data
    const yearColumns = [];
    if (dataArray.length > 0) {
        Object.keys(dataArray[0]).forEach(key => {
            if (/^\d{4}$/.test(key)) yearColumns.push(key);
        });
    }
    yearColumns.sort();
    
    // Categories that should be bold headers (main sections)
    const mainCategories = [
        'الموجودات', 'موجودات غير متداولة', 'موجودات متداولة',
        'حقوق المساهمين والمطلوبات', 'حقوق المساهمين', 'المطلوبات',
        'مطلوبات غير متداولة', 'مطلوبات متداولة'
    ];
    
    dataArray.forEach((item, idx) => {
        const label = (item.Label || item.label || '').toString().trim();
        const note = (item['إيضاح'] || item['ايضاح'] || '').toString().trim();
        
        const row = tbody.insertRow();
        
        // Determine row type
        const hasValues = yearColumns.some(year => item[year] !== null && item[year] !== undefined && item[year] !== '');
        const isMainHeader = mainCategories.some(cat => normalizeArabic(label).includes(normalizeArabic(cat)));
        const isSubtotal = hasValues && !note; // Has values but no note number
        const isTitle = !hasValues && !isMainHeader; // No values and not a main category
        
        // Label cell with appropriate styling and indentation
        const labelCell = row.insertCell();
        labelCell.textContent = label;
        
        if (isMainHeader) {
            // Main category headers
            labelCell.style.fontWeight = 'bold';
            labelCell.style.backgroundColor = '#e8e8e8';
            labelCell.style.fontSize = '15px';
            row.style.backgroundColor = '#e8e8e8';
        } else if (isTitle) {
            // Title rows (like company name, statement title)
            labelCell.style.fontWeight = 'bold';
            labelCell.style.textAlign = 'center';
            labelCell.style.fontSize = '14px';
        } else if (isSubtotal) {
            // Subtotal rows (have values but no note)
            labelCell.style.fontWeight = 'bold';
            labelCell.style.paddingRight = '20px';
        } else if (note) {
            // Detail line items (have note numbers)
            labelCell.style.paddingRight = '40px';
        }
        
        // Note cell
        const noteCell = row.insertCell();
        noteCell.textContent = note;
        noteCell.style.textAlign = 'center';
        if (isMainHeader || isTitle) {
            noteCell.style.backgroundColor = row.style.backgroundColor;
        }
        
        // Year value cells
        yearColumns.forEach(year => {
            const valueCell = row.insertCell();
            const val = item[year];
            if (val !== null && val !== undefined && val !== '') {
                valueCell.textContent = typeof val === 'number' ? val.toLocaleString() : val;
                valueCell.style.textAlign = 'right';
                valueCell.style.fontWeight = isSubtotal ? 'bold' : 'normal';
            } else {
                valueCell.textContent = '';
            }
            if (isMainHeader || isTitle) {
                valueCell.style.backgroundColor = row.style.backgroundColor;
            }
        });
    });
    
    console.log('Financial statement table populated with', dataArray.length, 'rows');
}

function logUnmappedLabels(dataArray, labelToValue) {
    try {
        const usedKeys = new Set();
        // Simulate which keys we used based on current mappings
        const mappingLabels = [
            'اسم الشركه','الشركه','شركة','الاسم التجاري','الاسم التجاري للشركه','موقع الشركه','الموقع','مجال العمل','حاله الشركه','الحاله','تاريخ التسجيل','راس المال','رأس المال','رأس المال المصرح والمكتتب به والمدفوع','توضيح القطاع','القطاع','المبيعات المحليه','المبيعات المصدره','مجموع المبيعات','اجمالي المبيعات','الانتاج','مخزون بضاعه جاهزه بدايه المده','مخزون بضاعه جاهزه اخر المده','مخزون بضاعه جاهزه نهايه المده'
        ];
        mappingLabels.forEach(l => usedKeys.add(normalizeArabic(l)));
        const all = dataArray.map(it => normalizeArabic((it.Label||it.label||'').toString()));
        const unmapped = all.filter(k => k && !usedKeys.has(k));
        if (unmapped.length) {
            console.log('Unmapped labels (for future mapping):', Array.from(new Set(unmapped)).slice(0,50));
        }
    } catch(_) {
        // ignore
    }
}

