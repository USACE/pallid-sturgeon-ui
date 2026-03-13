FROM httpd:2.4
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf
COPY dev2-crrel-mil.crt /usr/local/apache2/conf/dev2-crrel-mil.crt
COPY dev2-crrel-mil.key /usr/local/apache2/conf/dev2-crrel-mil.key
COPY CRREL-CA2.crt /usr/local/apache2/conf/CRREL-CA2.crt
COPY authservice-certificate-file.pem /usr/local/apache2/conf/authservice-certificate-file.pem
COPY trustore.crt /usr/local/apache2/conf/trustore.crt
