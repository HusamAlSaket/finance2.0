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

        <!-- قائمة المركز المالي (Financial Statement from JSON) -->
        <section class="form-section">
            <h2 class="section-title">قائمة المركز المالي</h2>
            <div class="table-responsive">
                <table class="data-table" style="width:100%;">
                    <thead>
                        <tr>
                            <th style="width:50%;">البند</th>
                            <th style="width:15%;">إيضاح</th>
                            <th style="width:17.5%;">2023</th>
                            <th style="width:17.5%;">2024</th>
                        </tr>
                    </thead>
                    <tbody id="financial_statement_table">
                        <!-- JSON data will be populated here -->
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
        
        <!-- القطاع وتفاصيل الميزانية -->
        <section class="form-section">
            <h2 class="section-title">القطاع وتفاصيل الميزانية</h2>

            <!-- الإيرادات -->
            <div class="form-grid-2" style="margin-bottom: 15px;">
                <div class="form-group">
                    <label>اجمالي ايراد النشاط الرئيسي</label>
                    <input type="number" id="main_activity_revenue" value="0">
                </div>
                <div class="form-group">
                    <label>اجمالي ايراد النشاط الثانوي</label>
                    <input type="number" id="secondary_activity_revenue" value="0">
                </div>
                <div class="form-group">
                    <label>مجموع الايرادات</label>
                    <input type="number" id="total_revenues_overview" value="0">
                </div>
            </div>

            <!-- مصاريف ادارية وعمومية -->
            <h3 class="section-title" style="border:0;margin-top:10px;">مصاريف إدارية وعمومية</h3>
            <div class="form-grid-2">
                <div class="form-group"><label>اجور و رواتب /ومنافعها</label><input type="number" id="wages_benefits" value="0"></div>
                <div class="form-group"><label>مساهمة المنشأة في الضمان اجتماعي</label><input type="number" id="social_security_contribution" value="0"></div>

                <div class="form-group"><label>مزايا أخرى للموظفين</label><input type="number" id="other_employee_benefits" value="0"></div>
                <div class="form-group"><label>قرطاسية ومطبوعات ولوازم</label><input type="number" id="stationery_supplies" value="0"></div>

                <div class="form-group"><label>كهرباء ومياه ومحروقات</label><input type="number" id="utilities_fuel" value="0"></div>
                <div class="form-group"><label>نفقات السيارات</label><input type="number" id="car_expenses" value="0"></div>

                <div class="form-group"><label>محروقات للتدفئة</label><input type="number" id="heating_fuel" value="0"></div>
                <div class="form-group"><label>نظافة / وضيافة</label><input type="number" id="cleaning_hospitality" value="0"></div>

                <div class="form-group"><label>اتصالات وانترنت وبريد</label><input type="number" id="communications" value="0"></div>
                <div class="form-group"><label>ايجارات ابنية</label><input type="number" id="building_rent" value="0"></div>

                <div class="form-group"><label>رسوم ورخص / و رسوم حكوميه/ واشتركات</label><input type="number" id="fees_licenses_subscriptions" value="0"></div>
                <div class="form-group"><label>تصاريح عمال</label><input type="number" id="worker_permits" value="0"></div>

                <div class="form-group"><label>استئجار سيارات والات</label><input type="number" id="vehicle_equipment_rental" value="0"></div>
                <div class="form-group"><label>صيانه عامه</label><input type="number" id="general_maintenance" value="0"></div>

                <div class="form-group"><label>نفقات صحية</label><input type="number" id="health_expenses" value="0"></div>
                <div class="form-group"><label>مصاريف حاسوب/ تشمل خدمات استشارات للكمبيوتر والبرامج</label><input type="number" id="computer_expenses_consulting" value="0"></div>

                <div class="form-group"><label>عمولات بنكيه</label><input type="number" id="bank_commissions" value="0"></div>
                <div class="form-group"><label>اتعاب مهنيه /قد تشمل استشارات وتدقيق حسابات</label><input type="number" id="professional_fees_audit" value="0"></div>

                <div class="form-group"><label>مصاريف سفر وتنقلات</label><input type="number" id="travel_expenses" value="0"></div>
                <div class="form-group"><label>مصاريف تدريب</label><input type="number" id="training_expenses" value="0"></div>

                <div class="form-group"><label>مصاريف تمويل</label><input type="number" id="financing_expenses" value="0"></div>
                <div class="form-group"><label>تبرعات ومنح</label><input type="number" id="donations_grants" value="0"></div>

                <div class="form-group"><label>فرق عملات</label><input type="number" id="currency_diff" value="0"></div>
                <div class="form-group"><label>غرامات</label><input type="number" id="fines" value="0"></div>

                <div class="form-group"><label>اقساط تامين مدفوعه</label><input type="number" id="insurance_premiums_paid" value="0"></div>
                <div class="form-group"><label>طوابع</label><input type="number" id="stamps" value="0"></div>

                <div class="form-group"><label>مسقفات</label><input type="number" id="property_taxes" value="0"></div>
                <div class="form-group"><label>نفقات أخرى</label><input type="number" id="other_expenses_misc" value="0"></div>

                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>الإجمالي الكلي</label>
                    <input type="number" id="admin_general_expenses_total" value="0">
                </div>
            </div>

            <!-- مواد أولية -->
            <h3 class="section-title" style="border:0;margin-top:10px;">مواد أولية</h3>
            <div class="form-grid-2">
                <div class="form-group"><label>مشتريات مواد اولية</label><input type="number" id="purchases_raw_materials" value="0"></div>
                <div class="form-group"><label>مخزون بداية العام</label><input type="number" id="beginning_inventory" value="0"></div>
                <div class="form-group"><label>مخزون نهاية العام</label><input type="number" id="ending_inventory" value="0"></div>
                <div class="form-group"><label>المستخدم بالانتاج والمواد الاولية</label><input type="number" id="used_in_production" value="0"></div>
            </div>

            <!-- النفقات الأخرى -->
            <h3 class="section-title" style="border:0;margin-top:10px;">النفقات الأخرى</h3>
            <div class="form-grid-2">
                <div class="form-group"><label>فوائد بنوك مدفوعة</label><input type="number" id="bank_interest_paid" value="0"></div>
                <div class="form-group"><label>تبرعات وتحويلات للغير</label><input type="number" id="donations_transfers" value="0"></div>
                <div class="form-group"><label>ارباح أسهم مدفوعة</label><input type="number" id="dividends_paid" value="0"></div>
                <div class="form-group"><label>المجموع</label><input type="number" id="other_section_total" value="0"></div>
            </div>

            <!-- المجموع الكلي -->
            <h3 class="section-title" style="border:0;margin-top:10px;">المجموع الكلي</h3>
            <div class="form-grid-2">
                <div class="form-group"><label>مجموع الايرادات</label><input type="number" id="total_revenues_sum" value="0"></div>
                <div class="form-group"><label>مجموع المصاريف الادارية والعمومية</label><input type="number" id="admin_general_expenses_sum" value="0"></div>
                <div class="form-group"><label>مجموع المواد الاولية</label><input type="number" id="raw_materials_sum" value="0"></div>
                <div class="form-group"><label>مجموع النفقات الأخرى</label><input type="number" id="other_expenses_sum" value="0"></div>
                <div class="form-group"><label>اهتلاك راس المال</label><input type="number" id="capital_depreciation_total" value="0"></div>
                <div class="form-group"><label>اجمالي المصاريف</label><input type="number" id="total_expenses_sum" value="0"></div>
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

