const mysql = require('mysql');
const fs = require('fs');

// 創建MySQL連接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // 使用你的MAMP設定中的密碼
    database: 'myecommerceappdb',
    port: 3306 // 使用你的MAMP設定中的端口
});

// 連接到MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

// 讀取JSON檔案
const rawData = fs.readFileSync('商品資料0627.json');
const products = JSON.parse(rawData);

// 插入產品資料
const insertProduct = (product) => {
    return new Promise((resolve, reject) => {
        const productQuery = 'INSERT INTO products (product_name, subcategory, brand, description, price) VALUES (?, ?, ?, ?, ?)';
        const productValues = [product.product_name, product.subcategory, product.brand, product.description, product.price];

        connection.query(productQuery, productValues, (err, result) => {
            if (err) {
                console.error('Error inserting product:', err.stack);
                reject(err);
                return;
            }
            console.log('Inserted product with ID:', result.insertId);
            resolve(result.insertId);
        });
    });
};

// 插入變體資料
const insertVariant = (productId, variant) => {
    return new Promise((resolve, reject) => {
        const variantQuery = 'INSERT INTO product_variants (product_id, color, size, inventory, sku, image) VALUES (?, ?, ?, ?, ?, ?)';
        const variantValues = [productId, variant.color, variant.size, variant.inventory, variant.sku, variant.image];

        connection.query(variantQuery, variantValues, (err, result) => {
            if (err) {
                console.error('Error inserting variant:', err.stack);
                reject(err);
                return;
            }
            console.log('Inserted variant for product ID:', productId);
            resolve();
        });
    });
};

// 處理所有產品及其變體
const insertAllProducts = async () => {
    try {
        for (const product of products) {
            const productId = await insertProduct(product);
            const variantPromises = product.productVariants.map(variant => insertVariant(productId, variant));
            await Promise.all(variantPromises);
        }
    } catch (error) {
        console.error('Error during insertion:', error);
    } finally {
        // 關閉連接
        connection.end();
    }
};

insertAllProducts();
