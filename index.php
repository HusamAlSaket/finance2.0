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
                    <div class="year-select">
                        <select id="classification">
                            <option value="">-- اختر --</option>
                        </select>
                        <span class="year-label">سنة الميزانية</span>
                        <span class="year-value">سنة 2023</span>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- معلومات الموجودات -->
        <section class="form-section">
            <h2 class="section-title">معلومات الموجودات</h2>
            <div class="form-grid-3">
                <div class="form-group">
                    <label>نوع الموجودات الثابتة:</label>
                    <select id="fixed_assets_type">
                        <option value="">يجب اختيار القطاع</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>القيمة الدفترية بداية العام:</label>
                    <input type="text" id="book_value_start" placeholder="ادخل صافي القيمة الدفترية">
                </div>
                
                <div class="form-group">
                    <label>الرياضي</label>
                    <input type="text" id="sports" placeholder="ادخل الملاحظات على نوع الموجودات المختار">
                </div>
            </div>
            
            <div class="form-group full-width">
                <label>ملاحظات:</label>
                <textarea id="notes" rows="3"></textarea>
            </div>
        </section>
        
        <!-- قيمة الموجودات المشتراة خلال العام -->
        <section class="form-section">
            <h2 class="section-title">قيمة الموجودات المشتراة خلال العام</h2>
            <div class="form-grid-2">
                <div class="form-group">
                    <label>جديدة:</label>
                    <input type="number" id="new_assets" value="0">
                </div>
                
                <div class="form-group">
                    <label>مستعملة:</label>
                    <input type="number" id="used_assets" value="0">
                </div>
            </div>
        </section>
        
        <!-- بيانات إضافية -->
        <section class="form-section">
            <h2 class="section-title">بيانات إضافية</h2>
            <div class="form-grid-2">
                <div class="form-group">
                    <label>الإضافات والتحسينات:</label>
                    <div class="input-with-button">
                        <input type="number" id="additions_improvements" value="0">
                        <button class="btn-input-note" type="button">يجب ادخال القيمة</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>التالف والمفقود (الاستبعادات):</label>
                    <input type="number" id="damaged_lost" value="0">
                </div>
                
                <div class="form-group">
                    <label>قيمة الموجودات المتاحة خلال العام:</label>
                    <div class="input-with-button">
                        <input type="number" id="available_assets_value" value="0">
                        <button class="btn-input-note" type="button">يجب ادخال القيمة</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>اهتلاك رأس المال الثابت خلال العام:</label>
                    <input type="number" id="depreciation_year" value="0">
                </div>
                
                <div class="form-group">
                    <label>صافي القيمة الدفترية في نهاية العام:</label>
                    <div class="input-with-button">
                        <input type="number" id="net_book_value_end" value="0">
                        <button class="btn-add" type="button">اضافة للقائمة</button>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- جدول الموجودات -->
        <section class="form-section">
            <h2 class="section-title">جدول الموجودات</h2>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>الرقم</th>
                            <th>الموجودات المتسلسل الثابتة</th>
                            <th>صافي القيمة الدفترية بداية العام</th>
                            <th>قيمة الموجودات المشتراة خلال العام</th>
                            <th>الاضافات والتحسينات</th>
                            <th>التالف والمفقود (الاستبعادات)</th>
                            <th>قيمة الموجودات المتاحة خلال العام</th>
                            <th>اهتلاك رأس المال الثابت خلال العام</th>
                            <th>صافي القيمة الدفترية في نهاية العام</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody id="assets_table_body">
                        <!-- Data will be populated here -->
                    </tbody>
                </table>
            </div>
        </section>
        
        <!-- معلومات الإنتاج -->
        <section class="form-section">
            <h2 class="section-title">معلومات الإنتاج</h2>
            <div class="form-grid-3">
                <div class="form-group">
                    <label>المبيعات المحلية:</label>
                    <input type="text" id="local_sales">
                </div>
                
                <div class="form-group">
                    <label>المبيعات المصدرة:</label>
                    <input type="text" id="exported_sales">
                </div>
                
                <div class="form-group">
                    <label>مجموع المبيعات:</label>
                    <input type="text" id="total_sales">
                </div>
                
                <div class="form-group">
                    <label>الإنتاج:</label>
                    <input type="text" id="production">
                </div>
                
                <div class="form-group">
                    <label>مخزون بضاعة جاهزة بداية المدة:</label>
                    <input type="text" id="inventory_start">
                </div>
                
                <div class="form-group">
                    <label>مخزون بضاعة جاهزة آخر المدة:</label>
                    <input type="text" id="inventory_end">
                </div>
            </div>
        </section>
        
        <!-- Contact Information Footer -->
        <div class="contact-info">
            <p>تم تطوير بوابة الخدمات الالكترونية الخاصة بادخال ميزانيات الشركات بواسط</p>
            <div class="contact-details">
                <p><strong>معلومات الاتصال</strong></p>
                <p><strong>هاتف:</strong> +96265600260 | <strong>الفاكس:</strong> +96265607058</p>
                <p><strong>العنوان:</strong> عمان - الشميساني - شارع الملكة نور</p>
                <p><strong>ساعات العمل:</strong> من الأحد إلى الخميس من الساعة 8:30 إلى الساعة 3:30</p>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
            <button class="btn-save" type="button" id="saveBtn">حفظ البيانات</button>
            <button class="btn-clear" type="button" id="clearBtn">تفريغ الحقول</button>
        </div>
    </div>
    
    <script src="api-mock.js"></script>
    <script src="script.js"></script>
</body>
</html>

