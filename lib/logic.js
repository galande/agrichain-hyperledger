/**
 * This transaction will add Agriculture commodity - By Farmer only
 * @param {org.agrichain.transaction.CreateAgriCommodity} commodityInfo
 * @transaction
 */

function createAgriCommodity(commodityInfo){
    const commodityNs = 'org.agrichain.asset';
    const participantNs = 'org.agrichain.participant';
    const commodityId = commodityInfo.commodityId;
    const factory = getFactory();

    let commodity = factory.newResource(commodityNs, 'AgriCommodity', commodityId);
    commodity.commodityName = commodityInfo.commodityName;
    commodity.commodityType = commodityInfo.commodityType;
    commodity.commoditySubType = commodityInfo.commoditySubType;
    commodity.unitPrice = commodityInfo.unitPrice;
    commodity.additionalInfo = commodityInfo.additionalInfo;
    commodity.farm = commodityInfo.farm;

    return getParticipantRegistry(participantNs + '.Farmer').then(function (participantRegistry) {
        return participantRegistry.exists(commodityInfo.farmerId);
    }).then(function (farmer) {
        if (!farmer){
            throw new Error(commodityInfo.farmerId + ' not exist in system.');
        }
        return getAssetRegistry(commodityNs + '.AgriCommodity')
    }).then(function (commodityRegistry) {
       let farmerRelation = factory.newRelationship(participantNs, 'Farmer', commodityInfo.farmerId);
       commodity.owner = farmerRelation;
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

    return getParticipantRegistry(participantNs + '.Farmer').then(function(farmerRegistry){
        return farmerRegistry.exists(businessContractInfo.farmerAadharId);
    }).then(function (farmer) {
        if (!farmer){
            throw new Error(businessContractInfo.farmerAadharId + ' Not exist in system');
        }
        return getParticipantRegistry(participantNs + '.Importer');
    }).then(function (importerRegistry) {
        return importerRegistry.exists(businessContractInfo.importerAadharId);
    }).then(function (importer) {
        if (!importer){
            throw new Error(businessContractInfo.importerAadharId + ' Not exist in system');
        }
        return getAssetRegistry(assetNs + '.BusinessContract')
    }) .then(function (businessContractRegistry) {
        let farmerRelation = factory.newRelationship(participantNs, 'Farmer', businessContractInfo.farmerAadharId);
        let importerRelation = factory.newRelationship(participantNs, 'Importer', businessContractInfo.importerAadharId);
        businessContract.farmer = farmerRelation;
        businessContract.importer = importerRelation;
        return businessContractRegistry.add(businessContract);
    }).then(function () {
        const eventNs = 'org.agrichain.event';
        let businessContractCreatedEvent = factory.newEvent(eventNs, 'BusinessContractCreated');
        businessContractCreatedEvent.businessContractId = businessContractId;
        businessContractCreatedEvent.businessStatus = businessContractInfo.businessStatus;
        emit(businessContractCreatedEvent); 
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
    let previousContractStatus;

    return getAssetRegistry(assetNs + '.BusinessContract').then(function (registry) {
        console.log('Asset registry recieved');  
        businessContractRegistry = registry;
        return businessContractRegistry.get(businessContractInfo.businessContractId);
    }).then(function (businessContract) {
        previousContractStatus = businessContract.businessStatus;
        businessContract.businessStatus = businessContractInfo.businessStatus;
        return businessContractRegistry.update(businessContract);
    }).then(function () {
        const eventNs = 'org.agrichain.event';
        let businessContractStatusChangedEvent = factory.newEvent(eventNs, 'ModifiedBusinessContractStatus');
        businessContractStatusChangedEvent.businessContractId = businessContractInfo.businessContractId;
        businessContractStatusChangedEvent.previousStatus = previousContractStatus;
        businessContractStatusChangedEvent.currentStatus = businessContractInfo.businessStatus;
        businessContractStatusChangedEvent.modifiedBy = getCurrentParticipant().getFullyQualifiedIdentifier();
        emit(businessContractStatusChangedEvent);
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
    const participantNs = 'org.agrichain.participant';

    return getParticipantRegistry(participantNs + '.Shipper').then(function (shipperRegistry) {
        return shipperRegistry.exists(shipmentContractInfo.shipper.aadharId);
    }).then(function (shipper) {
        console.log(shipper);
        
        if (!shipper){
            throw new Error(shipmentContractInfo.shipper + ' Not exist in system.');
        }
        return getAssetRegistry(assetNs + '.BusinessContract');
    }).then(function (businessContractRegistry) {
        return businessContractRegistry.get(shipmentContractInfo.businessForShipment.businessContractId);
    }).then(function (businessContract) {
        console.log(businessContract);
        
        if (businessContract.businessStatus != 'ACCEPTED'){
            throw new Error(shipmentContractInfo.businessForShipment + ' is not in ACCEPTED status');
        }
        return getAssetRegistry(assetNs + '.ShipementContract');     
    }).then(function (shipmentContractRegistry) {
        let shipmentContract = factory.newResource(assetNs, 'ShipementContract', shipmentContractInfo.shipementContractId);
        shipmentContract.businessForShipment = shipmentContractInfo.businessForShipment;
        shipmentContract.shipper = shipmentContractInfo.shipper;
        shipmentContract.pickUpLocation = shipmentContractInfo.pickUpLocation;
        shipmentContract.dropLocation = shipmentContractInfo.dropLocation;
        shipmentContract.arrivalDateTime = shipmentContractInfo.arrivalDateTime;
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
        }).then(function () {
            const eventNs = 'org.agrichain.event';
            let shipementCreatedEvent = factory.newEvent(eventNs, 'ShipmentCreated');
            shipementCreatedEvent.shipmentId = shipmentInfo.shipmentId;
            shipementCreatedEvent.shipmentContract = shipmentInfo.shipementContract.shipementContractId;
            emit(shipementCreatedEvent);
        })
    }

    /**
     * This ChangeShipemtStatusAndLocation transaction will change status and location to shipment- Shipper
     * @param {org.agrichain.transaction.ChangeShipemtStatusAndLocation} shipmentInfo
     * @transaction
     */

     function changeShipemtStatusAndLocation(shipmentInfo) {
         
        const assetNs = 'org.agrichain.asset';
        let shipmentRegistry = {};
        let previousShipementStatus;
        
        return getAssetRegistry(assetNs + '.Shipement').then(function (registry) {
            shipmentRegistry = registry;
            return shipmentRegistry.get(shipmentInfo.shipmentId);
        }).then(function (shipment) {
            previousShipementStatus = shipment.status;
            shipment.status = shipmentInfo.status;
            shipment.currentLocation = shipmentInfo.currentLocation;
            return shipmentRegistry.update(shipment);
        }).then(function () {
            const eventNs = 'org.agrichain.event';
            let shipmentStatusModifiedEvent = getFactory().newEvent(eventNs, 'ModifiedShipmentStatus');
            shipmentStatusModifiedEvent.shipmentId = shipmentInfo.shipmentId;
            shipmentStatusModifiedEvent.previousStatus = previousShipementStatus;
            shipmentStatusModifiedEvent.currentStatus = shipmentInfo.status;
            shipmentStatusModifiedEvent.modifiedBy = getCurrentParticipant().getFullyQualifiedIdentifier();
            emit(shipmentStatusModifiedEvent);
        })
     }

     /**
      * This AddTemperatureReading transaction will add temprature reading to shipement - Shipper
      * @param {org.agrichain.transaction.AddTemperatureReading} shipmentInfo
      * @transaction
      */

      function addTemperatureReading(shipmentInfo) {
          
        const factory = getFactory();
        const assetNs = 'org.agrichain.asset';
        let shipmentRegistry = {};

        return getAssetRegistry(assetNs + '.Shipement').then(function (registry) {
            shipmentRegistry = registry;
            return shipmentRegistry.get(shipmentInfo.shipmentId);
        }).then(function (shipement) {
            if (!shipement){
                throw new Error(shipmentInfo.shipmentId + " Not available in system.");
            }
              
            let temperatureReadingConcept = factory.newConcept(assetNs, 'TemperatureReading');
            temperatureReadingConcept.temperature = shipmentInfo.currentTemprature; 
            temperatureReadingConcept.temperatureTakenTime = new Date();
            if (shipement.temperatureReadings){
                shipement.temperatureReadings.push(temperatureReadingConcept);
                console.log("Push called");
                
            }else{
                shipement.temperatureReadings = [temperatureReadingConcept];
                console.log("Normal Called");
                
            }

            return shipmentRegistry.update(shipement);
        }).then(function () {
            const eventNs = 'org.agrichain.event';
            let temperatureReadingEvent = factory.newEvent(eventNs, 'AddedTemperatureReadingToShipemt');
            temperatureReadingEvent.shipmentId = shipmentInfo.shipmentId;
            temperatureReadingEvent.temprature = shipmentInfo.currentTemprature;
            emit(temperatureReadingEvent);
        })
      }

      /**
       * This AddCommodityToBusinessContract transaction will add Agricommodity to business Transaction- Farmer
       * @param {org.agrichain.transaction.AddCommodityToBusinessContract} businessCommodityInfo
       * @transaction
       */

       function addCommodityToBusinessContract(businessCommodityInfo) {
           
            const assetNs = 'org.agrichain.asset';
            let businessContractRegistry = {};

            return getAssetRegistry(assetNs + '.BusinessContract').then(function (registry) {
                businessContractRegistry = registry;
                return businessContractRegistry.get(businessCommodityInfo.businessContractId);
            }).then(function (businessContract) {
                if(!businessContract){
                    throw new Error(businessCommodityInfo.businessContractId + ' Not available in system.');
                }

                if (businessContract.commodities){
                    businessContract.commodities.push(businessCommodityInfo.commodity);
                }else{
                    businessContract.commodities = [businessCommodityInfo.commodity];
                }
                return businessContractRegistry.update(businessContract);
            }).then(function () {
                const eventNs = 'org.agrichain.event';
                let commodityAddedToBusinessContractEvent = getFactory().newEvent(eventNs, 'CommodityAddedToBusinessContract');
                commodityAddedToBusinessContractEvent.businessContractId = businessCommodityInfo.businessContractId;
                commodityAddedToBusinessContractEvent.commodity = businessCommodityInfo.commodity.commodityId;
                emit(commodityAddedToBusinessContractEvent);
            })
       }