#!/bin/bash

echo "=== Fixing Finance Project Redirect Issue ==="

# 1. Navigate to the web directory
cd /var/www

echo "Current directory structure:"
ls -la

# 2. Check if finance2.0 directory exists
if [ ! -d "finance2.0" ]; then
    echo "ERROR: finance2.0 directory not found!"
    exit 1
fi

# 3. Create .htaccess for finance2.0 directory
echo "Creating .htaccess for finance2.0 directory..."
cat > finance2.0/.htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Ensure this directory serves the finance project
DirectoryIndex index.php index.html

# Optional: Add security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

# 4. Check for existing .htaccess in root that might be causing redirects
echo "Checking for problematic .htaccess in root..."
if [ -f ".htaccess" ]; then
    echo "Found .htaccess in root directory:"
    cat .htaccess
    echo ""
    echo "Checking for redirect rules..."
    if grep -q "Redirect\|RewriteRule.*finance" .htaccess; then
        echo "WARNING: Found redirect rules that might affect finance project!"
        echo "Backing up current .htaccess..."
        cp .htaccess .htaccess.backup.$(date +%Y%m%d_%H%M%S)
    fi
fi

# 5. Check Apache configuration
echo "Checking Apache virtual hosts..."
apache2ctl -S 2>/dev/null || httpd -S 2>/dev/null

# 6. Test the configuration
echo "Testing Apache configuration..."
apache2ctl configtest 2>/dev/null || httpd -t 2>/dev/null

# 7. Restart Apache
echo "Restarting Apache..."
systemctl restart apache2 2>/dev/null || systemctl restart httpd 2>/dev/null

echo "=== Fix Complete ==="
echo "Please test your domains:"
echo "1. Main domain: http://85.31.238.191/"
echo "2. Finance project: http://finance2.85.31.238.191.nip.io/"
echo "3. Direct access: http://85.31.238.191/finance2.0/"
