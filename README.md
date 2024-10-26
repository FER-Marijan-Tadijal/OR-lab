# Kolegij Otvoreno Računarstvo
Repozitorij za laboratorijske vježbe
## Author
Marijan Tadijal
## Dataset version
1.0
## Dataset language
English, Croatian
## Publication date
2024-10-26
## Date format
ISO 8601
## Spatial coverage
Croatia
## Dataset period
2024-10-20 - 2024-10-25
## Update frequency
Irregular
## Contact Point
marijan.tadijal@fer.unizg.hr
## Keywords
Rain Gauge Croatia Meteorological

Attributes are:  
INT id - Weather station ID in the database  
VARCHAR(50) name - Weather station name  
DOUBLE latitude - Weather station latitude  
DOUBLE longitude - Weather station longitude  
INT elevation - Weather station elevation (height from sea level)  
TIMESTAMP dateSetUp - Date at which the weather station was set up  
BOOLEAN isActive - Is the weather station still active (or is it inactive)?  
BOOLEAN isAutomatic - Is weather station data updated remotely (or manually)?  
RECORDING recordings - Array of recordings  

RECORDING consists of:  
TIMESTAMP timestamp - Timestamp at which measurement was taken  
DOUBLE value - Rainfall in millimetres  
INTERVAL interval - Interval length during which rainfall was collected. That is, the rainfall was collected during the period [Timestamp - interval, timestamp]  

Dataset contains, but is not entirely consisted of, data from the Croatian Meteorological and Hydrological Service (DHMZ)
