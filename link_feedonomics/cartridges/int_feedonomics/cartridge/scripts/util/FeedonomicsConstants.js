'use strict';

var EXPORT_TYPE = {
    "CATALOG" 		: "CATALOG",
    "INVENTORY"     : "INVENTORY"
};

var HEADER_VALUES = {
    "ID"                      : "id",
    "NAME"                    : "name",
    "TITLE"                   : "title",
    "DESCRIPTION"             : "description",
    "UPC"                     : "upc",
    "IMAGE"                   : "image",
    "PRODUCT_LINK"            : "productLink",
    "CATEGORY"                : "category",
    "MASTER_PRODUCT_ID"       : "itemGroupID",
    "BRAND"                   : "brand",
    "PRICE"                   : "price",
    "INVENTORY"               : "invetory",
    "LIST_PRICE"              : "listPrice",
    "SALE_PRICE"              : "salePrice",
    "IN_STOCK"                : "in_stock",
    "ADDTIONAL_IMAGE_LINKS"   : "additional_image_links",
    "CUSTOM_FIELDS"           : "specifications",
    "VARIANT_ATTRIBUTES"      : "variantJSON",
    "PRODUCT_TYPE"            : "productType",
    "MANUFACTURER_NAME"       : "manufacturer_name",
    "MANUFACTURER_SKU"        : "manufacturer_sku"
};

var FILE_NAME = {
    "CATALOG"    : "export-catalog",
    "INVENTORY"  : "export-inventory"
}

var FILE_EXTENSTION = {
    "XML" : "xml",
    "CSV" : "csv"
}

module.exports = {
    EXPORT_TYPE      : EXPORT_TYPE,
    HEADER_VALUES    : HEADER_VALUES,
    FILE_NAME        : FILE_NAME,
    FILE_EXTENSTION  : FILE_EXTENSTION
};