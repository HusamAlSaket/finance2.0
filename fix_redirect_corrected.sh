#!/bin/bash

echo "=== Fixing Finance Project Redirect Issue ==="

# 1. Navigate to the web directory
cd /var/www

echo "Current directory structure:"
ls -la

# 2. Check if Finance2 directory exists (with capital F)
if [ ! -d "Finance2" ]; then
    echo "ERROR: Finance2 directory not found!"
    exit 1
fi

# 3. Create .htaccess for Finance2 directory
echo "Creating .htaccess for Finance2 directory..."
cat > Finance2/.htaccess << 'EOF'
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

# 5. Check what's in the Finance2 directory
echo "Contents of Finance2 directory:"
ls -la Finance2/

# 6. Check Apache configuration
echo "Checking Apache virtual hosts..."
apache2ctl -S 2>/dev/null || httpd -S 2>/dev/null

# 7. Test the configuration
echo "Testing Apache configuration..."
apache2ctl configtest 2>/dev/null || httpd -t 2>/dev/null

# 8. Restart Apache
echo "Restarting Apache..."
systemctl restart apache2 2>/dev/null || systemctl restart httpd 2>/dev/null

echo "=== Fix Complete ==="
echo "Please test your domains:"
echo "1. Main domain: http://85.31.238.191/"
echo "2. Finance project: http://finance2.85.31.238.191.nip.io/"
echo "3. Direct access: http://85.31.238.191/Finance2/"
