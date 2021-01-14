from datetime import datetime as dt, time, timedelta
import datetime 

def extractData(mongodata) -> list:
    data = [doc for doc in mongodata]
    for doc in data:
        doc['_id'] = str(doc['_id'])
    
    return data

def filterBetweenDates(data, date1, date2) -> list:
    def filterfunc(dic) -> bool:
        ele = dic['Day']
        if ele >= date1 and ele <= date2:
            return True
        else:
            return False
    
    return filter(filterfunc, data)

def splitTempAndHumidity(filteredData, date1, date2) -> tuple:
    labels = []
    temp = []
    humidity = []
    for doc in filteredData:
        if date1 == date2:
            labels.append(doc['Time'])
        else:
            labels.append(doc['Day'])
        temp.append(doc.get('Temperature', None))
        humidity.append(doc.get('Humidity', None))
    return (labels, temp, humidity)

def fillMissingValues(data):
    if len(data) == 1: return (data[0], data)
    runningSum = 0
    numbers = 0
    for item in data:
        if item != None:
            runningSum += item
            numbers += 1
    avg = runningSum / numbers
    for (idx, item) in enumerate(data):
        if item == None:
            data[idx] = avg
    return (avg, data)

def smoothenData(data, timeline, avg):
    label = []
    newData = []
    prevTimeline = None
    for (idx, item) in enumerate(data):
        if prevTimeline == timeline[idx]: continue 
        if prevTimeline != None:    
            while prevTimeline + timedelta(days=1) < timeline[idx]:
                newData.append(avg)
                prevTimeline = prevTimeline + timedelta(days=1)
                label.append(prevTimeline)    

        newData.append(item)    
        prevTimeline = timeline[idx]
        label.append(prevTimeline)
    
    return (newData, label)

def convertValuesToFloat(item):
    try:
        return float(item)
    except Exception:
        return None

def cleanAndSmoothData(labels, temp, humidity) -> dict:
    temp = list(map(convertValuesToFloat, temp))
    (avg_temp, temp) = fillMissingValues(temp)
    humidity = list(map(convertValuesToFloat, humidity))
    (avg_humidity, humidity) = fillMissingValues(humidity)

    if isinstance(labels[0], datetime.time):
        newLabels = list(map(lambda label: label.strftime("%I:%M:%S %p"), labels))
        return {
            'temperature': temp,
            'humidity': humidity,
            'labels': newLabels,
        }
    else:
        (newTemp, _labels) = smoothenData(temp, labels, avg_temp)
        (newHumidity, _) = smoothenData(humidity, labels, avg_humidity)
        
        newLabels = list(map(lambda label: label.strftime("%b %d, %Y"), _labels))
        return {
            'temperature': newTemp,
            'humidity': newHumidity,
            'labels': newLabels,
        }
    