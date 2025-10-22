<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ادخال جديد / ميزانيات شركات القطاع الصناعي</title>
    <link rel="stylesheet" href="style.css?v=2">
</head>
<body>
    <div class="container">
        <h1 class="main-title">ادخال جديد / ميزانيات شركات القطاع الصناعي</h1>
        
        <!-- معلومات الشركة -->
        <section class="form-section">
            <h2 class="section-title">معلومات الشركة</h2>
            
            <!-- Search Result Info Box -->
            <div id="searchResultBox" class="search-result-box" style="display: none;">
                <div class="info-message">
                    - على يمين لوحة المفاتيح اضغط زكي أو واحد على (Ctrl+Shift)
                    <br>
                    - ادخل المحقق اللاثت من الاسم المطبوع الباحث عنه ام اضغط (باحث)
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>الرقم الوطني للمنشأة</label>
                    <div class="input-with-button">
                        <input type="text" id="national_number" placeholder="200205004">
                        <button class="btn-search" type="button" id="searchBtn">بحث</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>اسم الشركة</label>
                    <input type="text" id="company_name" readonly>
                </div>
            </div>
            
            <!-- Search Results Table -->
            <div id="searchResults" class="search-results" style="display: none;">
                <h3 class="results-title">نتيجة البحث</h3>
                <div class="table-responsive">
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>الرقم الوطني للمنشأة</th>
                                <th>اسم الشركة</th>
                                <th>النوع</th>
                                <th>رقم التسجيل</th>
                                <th>تاريخ التسجيل</th>
                                <th>رأس المال</th>
                                <th>الحالة</th>
                                <th>المحافظة</th>
                                <th>التلفون</th>
                                <th>الحلوى</th>
                            </tr>
                        </thead>
                        <tbody id="searchResultsBody">
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Company Details Form (appears after selection) -->
            <div id="companyDetailsForm" class="form-grid" style="display: none; margin-top: 20px;">
                <div class="form-group">
                    <label>الاسم التجاري للشركة</label>
                    <input type="text" id="trade_name" readonly>
                </div>
                
                <div class="form-group">
                    <label>موقع الشركة</label>
                    <input type="text" id="company_location" readonly>
                </div>
                
                <div class="form-group">
                    <label>مجال العمل</label>
                    <input type="text" id="work_field" readonly>
                </div>
                
                <div class="form-group">
                    <label>حالة الشركة</label>
                    <input type="text" id="company_status" readonly>
                </div>
                
                <div class="form-group">
                    <label>تاريخ التسجيل</label>
                    <input type="text" id="registration_date" readonly>
                </div>
                
                <div class="form-group">
                    <label>رأس المال</label>
                    <input type="text" id="capital" readonly>
                </div>
                
                <div class="form-group">
                    <label>توضيح القطاع</label>
                    <input type="text" id="sector_description">
                </div>
            </div>
            
            <button class="btn-balance" type="button">عرض الميزانية</button>
        </section>
        
        <!-- القطاع والسنة المالية -->
        <section class="form-section">
            <h2 class="section-title">القطاع والسنة المالية</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label>القسم الرئيسي</label>
                    <select id="main_section">
                        <option value="">-- اختر --</option>
                        <option value="القسم الفرعي">القسم الفرعي</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>التصنيف</label>
                    <select id="classification">
                        <option value="">-- اختر --</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>سنة الميزانية</label>
                    <select id="year_selector" disabled>
                        <option value="">-- اختر السنة --</option>
                    </select>
                </div>
            </div>
        </section>
        
        <!-- Dynamic Forms Container - populated from JSON -->
        <section class="form-section" id="dynamic_forms_container" style="display:none;">
            <h2 class="section-title">البيانات المالية</h2>
            <div id="dynamic_fields" class="form-grid-2">
                <!-- Dynamic fields will be created here based on JSON -->
            </div>
        </section>


        
        

        <!-- Contact Information Footer -->
        <!-- <div class="contact-info">
            <p>تم تطوير بوابة الخدمات الالكترونية الخاصة بادخال ميزانيات الشركات بواسط</p>
            <div class="contact-details">
                <p><strong>معلومات الاتصال</strong></p>
                <p><strong>هاتف:</strong> +96265600260 | <strong>الفاكس:</strong> +96265607058</p>
                <p><strong>العنوان:</strong> عمان - الشميساني - شارع الملكة نور</p>
                <p><strong>ساعات العمل:</strong> من الأحد إلى الخميس من الساعة 8:30 إلى الساعة 3:30</p>
            </div>
        </div> -->
        
        <!-- Action Buttons -->
        <div class="action-buttons">
            <input type="file" id="jsonUpload" accept="application/json" class="visually-hidden">
            <label for="jsonUpload" class="btn-file">اختيار ملف JSON</label>
            <button class="btn-save" type="button" id="importJsonBtn">استيراد JSON</button>
            <button class="btn-save" type="button" id="saveBtn">حفظ البيانات</button>
            <button class="btn-export" type="button" id="exportCsvBtn">تصدير إلى CSV</button>
            <button class="btn-clear" type="button" id="clearBtn">تفريغ الحقول</button>
        </div>
    </div>
    
    <script src="api-mock.js"></script>
    <script src="script.js"></script>
    <script>
    // Ensure global wrapper exists even if bundlers/scopes interfere
    window.__exportCsvFallback = function() {
        try {
            if (typeof window.exportToCSV === 'function') {
                return window.exportToCSV();
            }
            // Minimal fallback: collect visible inputs and labels
            const rows = [];
            rows.push('نوع البيانات,الحقل,القيمة');
            // Company info
            const companyMap = [
                ['معلومات الشركة','الرقم الوطني للمنشأة','national_number'],
                ['معلومات الشركة','اسم الشركة','company_name'],
                ['معلومات الشركة','الاسم التجاري للشركة','trade_name'],
                ['معلومات الشركة','موقع الشركة','company_location'],
                ['معلومات الشركة','مجال العمل','work_field'],
                ['معلومات الشركة','حالة الشركة','company_status'],
                ['معلومات الشركة','تاريخ التسجيل','registration_date'],
                ['معلومات الشركة','رأس المال','capital'],
                ['معلومات الشركة','توضيح القطاع','sector_description']
            ];
            companyMap.forEach(([type,label,id])=>{
                const el=document.getElementById(id);
                if(el){
                    rows.push(type+','+label+','+(el.value||''));
                }
            });
            // Sector info
            const sectorMap = [
                ['القطاع والسنة المالية','القسم الرئيسي','main_section'],
                ['القطاع والسنة المالية','التصنيف','classification'],
                ['القطاع والسنة المالية','سنة الميزانية','year_selector']
            ];
            sectorMap.forEach(([type,label,id])=>{
                const el=document.getElementById(id);
                if(el){
                    rows.push(type+','+label+','+(el.value||''));
                }
            });
            // Dynamic data
            document.querySelectorAll('#dynamic_fields .form-group').forEach(group=>{
                const labelEl=group.querySelector('label');
                const inputEl=group.querySelector('input');
                if(labelEl&&inputEl){
                    rows.push('البيانات المالية,'+labelEl.textContent.replace(/,/g,'،')+','+(inputEl.value||''));
                }
            });
            const BOM='\uFEFF';
            const blob=new Blob([BOM+rows.join('\n')],{type:'text/csv;charset=utf-8;'});
            const a=document.createElement('a');
            a.href=URL.createObjectURL(blob);
            const d=new Date();
            const name='تصدير_بيانات_'+d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'.csv';
            a.download=name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch(err){
            console.error('CSV fallback export failed:', err);
            alert('تعذر التصدير.');
        }
    };
    // Bind button safely (single source of truth)
    (function(){
        var btn=document.getElementById('exportCsvBtn');
        if(btn){
            btn.addEventListener('click', function(){ window.__exportCsvFallback(); }, { once: false });
        }
    })();
    </script>
</body>
</html>

