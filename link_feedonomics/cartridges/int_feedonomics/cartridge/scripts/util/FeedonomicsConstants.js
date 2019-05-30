'use strict';

var EXPORT_TYPE = {
    CATALOG: 'CATALOG',
    INVENTORY: 'INVENTORY'
};

var HEADER_VALUES = {
    ID: 'id',
    NAME: 'name',
    TITLE: 'title',
    DESCRIPTION: 'description',
    UPC: 'upc',
    IMAGE: 'image_link',
    PRODUCT_LINK: 'link',
    CATEGORY: 'category',
    MASTER_PRODUCT_ID: 'item_group_id',
    BRAND: 'brand',
    PRICE: 'price',
    BOOKPRICE: 'book_price',
    PROMOPRICE: 'promo_price',
    INVENTORY: 'inventory',
    IN_STOCK: 'in_stock',
    ADDTIONAL_IMAGE_LINKS: 'additional_image_link',
    CUSTOM_FIELDS: 'specifications',
    VARIANT_ATTRIBUTES: 'variantjson',
    PRODUCT_TYPE: 'producttype',
    MANUFACTURER_NAME: 'manufacturer_name',
    MANUFACTURER_SKU: 'manufacturer_sku',
    ONLINE: 'online'
};

var FILE_NAME = {
    CATALOG: 'export-catalog',
    INVENTORY: 'export-inventory'
};

var FILE_EXTENSTION = {
    XML: 'xml',
    CSV: 'csv'
};

var IMAGE_TYPE = 'large';
var FILE_SEPARATOR = ',';

module.exports = {
    EXPORT_TYPE: EXPORT_TYPE,
    HEADER_VALUES: HEADER_VALUES,
    FILE_NAME: FILE_NAME,
    FILE_EXTENSTION: FILE_EXTENSTION,
    IMAGE_TYPE: IMAGE_TYPE,
    FILE_SEPARATOR: FILE_SEPARATOR
};
