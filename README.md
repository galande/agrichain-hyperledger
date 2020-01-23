# agrichain-network

This is the network for agricultural commodity on hyperldger fabric blockchain

# Participant: 
Farmer, Importer, Shipper, Regulator(Agri Board)

# Asset: 
AgriCommodity, ConTract, Shipment 

# AgriAsset Type : 
Animal, Fruit, Food, Diary Products

Subtypes: FOOD
Cereals:Barley, Oats, Wheat
Pulses:Field Beans, Peas, Soybeans
Forage:Alfalfa, Forage Seed, Tame Hay, Timothy Hay
Oil Seeds:Canola, Flax, Sunflowers
Special Crops:Buckwheat, Canary Seed, Honey, Industrial Hemp, Potatoes, Vegetables, Wild Rice
-------
Animal:
Poultry:Chicken,Eggs,Turkey
Livestock:Beef, Beef Genetics, Dairy Genetics, Pork, Pork Genetics, Processed Pork, Sheep
-------
DiaryProducts:
Milk: Buffalow, Cow, Desi Cow, Powederd Milk
Butter: Buttermilk, Ghee
Cheese: Curd, Panner, Cream Cheese
Ice Cream: Ice Milk, Frozen Custard
--------------------------------------
Friuts:
Apples and pears
Citrus – oranges, grapefruits, mandarins and limes
Stone fruit – nectarines, apricots, peaches and plums
Tropical and exotic – bananas and mangoes
Berries – strawberries, raspberries, blueberries, kiwifruit and passionfruit
Melons – watermelons, rockmelons and honeydew melons
Tomatoes and avocados.
Other:Bison

===========================
# Transactions:

1) Add Commodity --> Farmer
--> createAgreCommodity
2) Add BusinessContract --> Farmer and Importer
--> createBusinessContract
3) Change BusinessContract status --> Farmer and Importer
--> ChangeBusinessContractStatus
3) Add ShipmentContract --> Importer and Shipper
--> CreateShipmentContract
4) Add Shipment --> Shipper
--> CreateShipement
5) Add Temprature to Shipment --> Shipper
--> EnterTempRatureReadingToShipment
6) Change Shipment status and location --> Shipper
--> ChangeShipemtStatusAndLocation (After we can add temp parm)
7) Accept Final Shipment status --> Importer
--> AcceptShipement
