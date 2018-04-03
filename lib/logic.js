/**
 * This transaction will add Agriculture commodity - By Farmer only
 * @param {org.agrichain.transaction.CreateAgriCommodity} commodityInfo
 * @transaction
 */

function createAgriCommodity(createAgriCommodity){
    const commodityNs = 'org.agrichain.asset';
    const commodityId = commodityInfo.commodityId;
    const factory = getFactory();

    let commodity = factory.newResource(commodityNs, 'AgriCommodity', commodityId);
    commodity.commodityName = commodityInfo.commodityName;
    commodity.commodityType = commodityInfo.commodityType;
    commodity.commoditySubType = commodityInfo.commoditySubType;
    commodity.unitPrice = commodityInfo.unitPrice;
    commodity.additionalInfo = commodityInfo.additionalInfo;
    commodity.farm = commodityInfo.farm;

    console.log(commodity);

   return getAssetRegistry(commodityNs + '.AgriCommodity').then(function (commodityRegistry) {
       return commodityRegistry.add(commodity);
   })   
}

/**
 * This CreateBusinessContract transaction will create business contrect between Farmer and Importer.
 * @param {org.agrichain.transaction.CreateBusinessContract} businessContractInfo
 * @transaction
 */

 function createBusinessContract(businessContractInfo) {
     
    const businessContractId = businessContractInfo.businessContractId;
    const assetNs = 'org.agrichain.asset';
    const participantNs = 'org.agrichain.participant';
    const factory = getFactory();

    let businessContract = factory.newResource(assetNs, 'BusinessContract', businessContractId);
    businessContract.contractDateTime = businessContractInfo.contractDateTime;
    businessContract.businessStatus = businessContractInfo.businessStatus;

    let farmerRelation = factory.newRelationship(participantNs, 'Farmer', businessContractInfo.farmerAadharId);
    let importerRelation = factory.newRelationship(participantNs, 'Importer', businessContractInfo.importerAadharId);
    businessContract.farmer = farmerRelation;
    businessContract.importer = importerRelation;

    console.log(businessContract);

    return getAssetRegistry(assetNs + '.BusinessContract').then(function (businessContractRegistry) {
        return businessContractRegistry.add(businessContract);
    })
 }

 /**
  * This ChangeBusinessContractStatus transaction will change business contract status- Farmer or Importer
  * @param {org.agrichain.transaction.ChangeBusinessContractStatus} businessContractInfo
  * @transaction
  */

  function ChangeBusinessContractStatus(businessContractInfo) {

    const factory = getFactory();
    const assetNs = 'org.agrichain.asset';
    let businessContractRegistry = {};

    return getAssetRegistry(assetNs + '.BusinessContract').then(function (registry) {
        console.log('Asset registry recieved');  
        businessContractRegistry = registry;
        return businessContractRegistry.get(businessContractInfo.businessContractId);
    }).then(function (businessContract) {
        businessContract.businessStatus = businessContractInfo.businessStatus;
        return businessContractRegistry.update(businessContract);
    })
  }

  /**
   * This CreateShipmentContract transaction will create shipment contract between Importer and Shipper- Importer and Shipper.
   * @param {org.agrichain.transaction.CreateShipmentContract} shipmentContractInfo
   * @transaction
   */

   function createShipmentContract(shipmentContractInfo) {

    const factory = getFactory();
    const assetNs = 'org.agrichain.asset';

    let shipmentContract = factory.newResource(assetNs, 'ShipementContract', shipmentContractInfo.shipementContractId);
    shipmentContract.businessForShipment = shipmentContractInfo.businessForShipment;
    shipmentContract.shipper = shipmentContractInfo.shipper;
    shipmentContract.pickUpLocation = shipmentContractInfo.pickUpLocation;
    shipmentContract.dropLocation = shipmentContractInfo.dropLocation;
    shipmentContract.arrivalDateTime = shipmentContractInfo.arrivalDateTime;
    
    return getAssetRegistry(assetNs + '.ShipementContract').then(function (shipmentContractRegistry) {
        return shipmentContractRegistry.add(shipmentContract);
    })
   }

   /**
    * This CreateShipement transaction will create shipment for for shipment contract- Shipper
    * @param {org.agrichain.transaction.CreateShipement} shipmentInfo
    * @transaction
    */

    function createShipement(shipmentInfo) {
        
        const factory = getFactory();
        const assetNs = 'org.agrichain.asset';

        let shipment = factory.newResource(assetNs, 'Shipement', shipmentInfo.shipmentId);
        shipment.shipementContract = shipmentInfo.shipementContract;
        shipment.status = shipmentInfo.status;

        return getAssetRegistry(assetNs + '.Shipement').then(function (shipmentRegistry) {
            return shipmentRegistry.add(shipment);
        })
    }

    /**
     * This ChangeShipemtStatusAndLocation transaction will change status and location to shipment- Shipper
     * @param {org.agrichain.transaction.ChangeShipemtStatusAndLocation} shipmentInfo
     * @transaction
     */

     function changeShipemtStatusAndLocation(shipmentInfo) {
         
        const assetNs = 'org.agrichain.asset';
        const shipmentRegistry = {};
        
        return getAssetRegistry(assetNs + '.Shipement').then(function (registry) {
            shipmentRegistry = registry;
            return shipmentRegistry.get(shipmentInfo.shipmentId);
        }).then(function (shipment) {
            shipment.status = shipmentInfo.status;
            shipment.currentLocation = shipmentInfo.currentLocation;
            return shipmentRegistry.update(shipment);
        })
     }