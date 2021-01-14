const APIHOST = "http://localhost:5000/"

const fetchData = (startDate, endDate) => (
    fetch(APIHOST+`alldata/${startDate}/${endDate}`)
    .then((response)=>response.json())
    .then((data)=>data)
    .catch((error)=>console.log("error while fetching data"))
);

export {
    fetchData,
}