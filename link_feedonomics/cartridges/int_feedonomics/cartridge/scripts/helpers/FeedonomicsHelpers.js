'use strict';

var FConstants = require('~/cartridge/scripts/util/FeedonomicsConstants')

/**
* This Function generates header for csv file
* @param exportType Export Type Catalog or Inventory
* @returns {Array} Header Values Array for CSV file
*/
function generateCSVHeader( exportType ) {
    var csvHeaderArray = [];

    if (exportType == FConstants.EXPORT_TYPE.CATALOG) {
        csvHeaderArray.push(FConstants.HEADER_VALUES.ID);
        csvHeaderArray.push(FConstants.HEADER_VALUES.NAME);
        csvHeaderArray.push(FConstants.HEADER_VALUES.TITLE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.DESCRIPTION);
        csvHeaderArray.push(FConstants.HEADER_VALUES.UPC);
        csvHeaderArray.push(FConstants.HEADER_VALUES.IMAGE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRODUCT_LINK);
        csvHeaderArray.push(FConstants.HEADER_VALUES.CATEGORY);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MASTER_PRODUCT_ID);
        csvHeaderArray.push(FConstants.HEADER_VALUES.BRAND);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.BOOKPRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PROMOPRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.INVENTORY);
        csvHeaderArray.push(FConstants.HEADER_VALUES.IN_STOCK);
        csvHeaderArray.push(FConstants.HEADER_VALUES.ADDTIONAL_IMAGE_LINKS);
        csvHeaderArray.push(FConstants.HEADER_VALUES.CUSTOM_FIELDS);
        csvHeaderArray.push(FConstants.HEADER_VALUES.VARIANT_ATTRIBUTES);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRODUCT_TYPE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MANUFACTURER_NAME);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MANUFACTURER_SKU);
        csvHeaderArray.push(FConstants.HEADER_VALUES.ONLINE);

    } else if (exportType == FConstants.EXPORT_TYPE.INVENTORY) {
           //TODO
    }

    return csvHeaderArray;
}

/**
* This Function creates file name with file name prefix
* @param {String} fileNamePrefix
* @returns {String} fileName
*/
function createFileName(fileNamePrefix,fileExtension) {
    var Calendar = require('dw/util/Calendar');
    var Site = require('dw/system/Site');
    var StringUtils = require('dw/util/StringUtils');
    var DATETIME_FORMAT = 'yyyy-MM-dd_HH-mm-ss-SSS';

    var calendar = new Calendar();
    var siteID = Site.getCurrent().getID();
    return fileNamePrefix + "_" + siteID + "_" + StringUtils.formatCalendar(calendar, DATETIME_FORMAT)+ "." + fileExtension;
}

/**
 * This function returns file extension based on parameter
 * @param {String} exportFormat Input Job Parameter
 * @returns {String} file name extension
 */
function getFileExtension(exportFormat) {
    if ( exportFormat && exportFormat.toLowerCase() == FConstants.FILE_EXTENSTION.XML) {
        return FConstants.FILE_EXTENSTION.XML;
    } else {
        return FConstants.FILE_EXTENSTION.CSV;
    }
}

/**
 * Calculates the Product's Image Absolute URL
 * @param {dw.catalog.Product} product - Product
 * @returns {string|null} - Product's Image Absolute URL or null
 */
function getProductImage(product) {
    var imageType = FConstants.IMAGE_TYPE;
    var productImage = product.getImage(imageType);
    if (productImage) {
        return productImage.getAbsURL().toString();
    }
    return null;
}

/**
 * Gets Product Assigned Categories
 * @param {dw.catalog.Product} product - Product
 * @returns {String} - Product's categories in JSON string
 */
function getOnlineSubCats(product) {
    var onlineCategories = product.getOnlineCategories();
    if (onlineCategories.length==0) {
        if (product.isVariant) {
            var pvm = product.variationModel;
            if (pvm) {
                var masterProduct = pvm.getMaster();
                onlineCategories = masterProduct.getOnlineCategories();
            }
        }
    }
    var catArray = [];
    var categoriesItr = onlineCategories.iterator();
    while (categoriesItr.hasNext()) {
        var category = categoriesItr.next();
        catArray.push(category.ID);
    }
    return catArray.join(FConstants.FILE_SEPARATOR);
}

/**
 * Return Master Product ID of the Variant
 * @param {dw.catalog.Product} product - Product
 * @returns {String} - Product's Master Id
 */
function getMasterID(product) {
    if ( product.isVariant() ) {
        var pvm = product.getVariationModel();
        return pvm ? pvm.getMaster().ID : "";
    }
    return "";
}

/**
 * Return Product's ATS value
 * @param {dw.catalog.Product} product - Product
 * #returns {Number} Product's ATS value
 */
function getATSValue(product) {
    var avm = product.availabilityModel;
    if (avm) {
        var inventoryRecord = avm.inventoryRecord;
        if (inventoryRecord && inventoryRecord.perpetual) {
            return 999999;
        } else if (inventoryRecord && inventoryRecord.ATS) {
            return inventoryRecord.ATS.value;
        } else {
            return new Number(0);
        }
    }
    return new Number(0);
}

/**
 * Returns all custom properties in JSON format
 * @param {dw.catalog.Product} Product
 * @returns {JSON} JSON of all the custom properties of product
 */
function getAllCustomProps(product) {
    var customJSON = {};
    Object.keys(product.custom).forEach(function(key) {
       customJSON[key] = this.custom[key].toString();
    }, product);
    return JSON.stringify(customJSON);
}

/**
 * Returns All Variation Attributes
 * @param {dw.catalog.Product} Product
 * @returns {JSON} JSON of all the variation attributes and values of product
 */
function getAllVariationAttrs(product) {
    var customJSON = {};
    var pvm = product.getVariationModel();
    var variationAttrs = pvm ? pvm.productVariationAttributes : null;
    if (variationAttrs && ( product.isVariant() || product.isVariationGroup())) {
        Object.keys(variationAttrs).forEach(function(key) {
            var varValue = this.getVariationValue(product, variationAttrs[key]);
            customJSON[variationAttrs[key].attributeID] = varValue ? varValue.value.toString() : "";
        }, pvm);
        return JSON.stringify(customJSON);
    } else if (variationAttrs && product.isMaster()){
        Object.keys(variationAttrs).forEach(function(index1) {
            var attrValueArray = [];
            var attrValues = this.getAllValues(variationAttrs[index1])
            Object.keys(attrValues).forEach(function(index2){
                this.push(attrValues[index2].value.toString());
            },attrValueArray);
            customJSON[variationAttrs[index1].attributeID] = attrValueArray.join(FConstants.FILE_SEPARATOR);
        }, pvm);
        return JSON.stringify(customJSON);
    }
    return "";
}

/**
 * Returns All Product Types
 * @param {dw.catalog.Product} Product
 * @returns {JSON} JSON of all applicable product types of product
 */
function getAllProductTypes(product) {
    var customJSON = {
        "bundle"             : product.isBundle(),
        "master"             : product.isMaster(),
        "option"             : product.isOptionProduct(),
        "set"                : product.isProductSet(),
        "variant"            : product.isVariant(),
        "variation_group"	 : product.isVariationGroup()
    };
    customJSON.item = !customJSON.master && !customJSON.variant && !customJSON.set
                      && !customJSON.bundle && !customJSON.variation_group && !customJSON.option;

    return JSON.stringify(customJSON);
}

/**
 * Returns All Product Images
 * @param {dw.catalog.Product} Product
 * @returns {String} all images of product of default type large
 */
function getAllImages(product) {
    var imageType = FConstants.IMAGE_TYPE;
    var productImageList = product.getImages(imageType);
    if (productImageList && productImageList.length>0) {
        var imageArray = [];
        for (var index in productImageList) {
            imageArray.push(productImageList[index].getAbsURL().toString());
            // Push only Top 10 images
            if (index == 9) {
                break;
            }
        }
        return imageArray.join(FConstants.FILE_SEPARATOR);
    }
    return "";
}

/**
 * Return Short and Long Description
 * @param {dw.catalog.Product} Product
 * @returns {JSON} JSON of Short and Long Description
 */
function getDescription(product) {
    var description = {
        "short_description" : (product.longDescription ? product.longDescription.toString() : ""),
        "long_description"  : (product.shortDescription ? product.shortDescription.toString() : "")
    }
    return JSON.stringify(description);
}

/**
 * Return Online Status
 * @param {dw.catalog.Product} Product
 * @returns {Number} 0 or 1
 */
function getOnlineStatus(product) {
    var isOnline = product.online;
    if (isOnline) {
        if (product.isVariant()) {
            var pvm = product.variationModel;
            isOnline = pvm ? pvm.master.online : isOnline;
        }
    }
    return isOnline ? 1 : 0;
}

/**
 * Return Online Status
 * @param {dw.catalog.Product} Product
 * @returns {Number} 0 or 1
 */
function getAvailabilityStatus(product) {
    var avm = product.availabilityModel;
    if (avm) {
        return avm.isOrderable() ? 1 : 0
    }
    return 0;
}

/**
 * Calculate Promo Price
 * @param {dw.catalog.Product} Product
 * @returns {Number} N/A or Price
 */
function calculatePromoPrice(product) {
    var Money = require('dw/value/Money');
    var PromotionMgr = require('dw/campaign/PromotionMgr');
    var promoPrice = "N/A";
    var PROMOTION_CLASS_PRODUCT = require('dw/campaign/Promotion').PROMOTION_CLASS_PRODUCT;
    var promotions = PromotionMgr.getActivePromotions().getProductPromotions(product);
    var promoPriceArray = [];
    if (promotions && promotions.length>0) {
        for (var index in promotions) {
            var promo = promotions[index];
            if (promo.getPromotionClass() != null && promo.getPromotionClass().equals(PROMOTION_CLASS_PRODUCT)) {
                var promoPriceObj = {};
                promoPriceObj[promo.ID] = promo.getPromotionalPrice(product).value;
                promoPriceArray.push(promoPriceObj);
            }
        }
        return promoPriceArray.length > 0 ? JSON.stringify(promoPriceArray) : promoPrice;
    }
    return promoPrice;
}

/**
 * Calculate PriceBooks Price
 * @param {dw.catalog.Product} Product
 * @returns {JSON} Price Books Price
 */
function calculatePriceBookPrices(product) {
    var priceModel = product.priceModel;
    var priceInfos = priceModel.priceInfos;
    var priceBookArray = [];
    if (priceInfos) {
        for (var index in priceInfos) {
            var priceInfo = priceInfos[index];
            var priceBookPrice = {};
            priceBookPrice[priceInfo.priceBook.ID] = priceInfo.price.value;
            priceBookArray.push(priceBookPrice);
        }
    }
    return JSON.stringify(priceBookArray);
}
/**
 * This function returns file extension based on parameter
 * @param {String} exportFormat Input Job Parameter
 * @returns {String} file name extension
 */
/*function createLocaleSpecificValue(product) {
    var json = {};
    var Site = require('dw/system/Site');
    var Template = require('dw/util/Template');
    var params = new dw.util.HashMap();
    params.put('product',product)
    var localeItr = Site.getAllowedLocales().iterator();
    while (localeItr.hasNext()) {
        var localeId = localeItr.next().ID;
        new Template('localespecificvalue',localeId).render(params).getText();
    }
}*/


module.exports = {
    generateCSVHeader        : generateCSVHeader,
    createFileName           : createFileName,
    getFileExtension         : getFileExtension,
    getProductImage          : getProductImage,
    getOnlineSubCats         : getOnlineSubCats,
    getMasterID              : getMasterID,
    getATSValue              : getATSValue,
    getAllCustomProps        : getAllCustomProps,
    getAllVariationAttrs     : getAllVariationAttrs,
    getAllProductTypes       : getAllProductTypes,
    getAllImages             : getAllImages,
    getDescription           : getDescription,
    getOnlineStatus          : getOnlineStatus,
    getAvailabilityStatus    : getAvailabilityStatus,
    calculatePromoPrice      : calculatePromoPrice,
    calculatePriceBookPrices : calculatePriceBookPrices
};