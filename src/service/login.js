const APIHOST = "http://localhost:5000/";

const verifyLogin = (token) => (
    fetch(APIHOST+`verifylogin/${token}`)
    .then(response => response.json())
);

const verifyCaptcha = (value) => (
    fetch(APIHOST+`verifycaptcha/${value}`)
    .then(response => response.json())
);

export {
    verifyLogin,
    verifyCaptcha
}