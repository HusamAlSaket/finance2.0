<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ادخال جديد / ميزانيات شركات القطاع الصناعي</title>
    <link rel="stylesheet" href="style.css">
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
            <input type="file" id="jsonUpload" accept="application/json" style="margin-inline-end: 10px;">
            <button class="btn-save" type="button" id="importJsonBtn">استيراد JSON</button>
            <button class="btn-save" type="button" id="saveBtn">حفظ البيانات</button>
            <button class="btn-clear" type="button" id="clearBtn">تفريغ الحقول</button>
        </div>
    </div>
    
    <script src="api-mock.js"></script>
    <script src="script.js"></script>
</body>
</html>

